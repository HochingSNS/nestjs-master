import { Logger } from '@nestjs/common';
import axios, { AxiosInstance, HttpStatusCode, Method } from 'axios';
import { TELESIGN_MESSAGE_IN_PROGRESS, TelesignEndpoint, TelesignMessageType } from './telesign.constant';
import { TelesignError } from './telesign.error';
import { ClientOptions, SendSmsRequest, SendSmsResponse } from './telesign.types';

export class TelesignApi {
  private readonly logger = new Logger(TelesignApi.name);
  private readonly client: AxiosInstance;

  constructor(private readonly options: ClientOptions) {
    const basic = Buffer.from(`${this.options.customerId}:${this.options.apiKey}`).toString('base64');

    this.client = axios.create({
      baseURL: this.options.baseUrl,
      timeout: this.options.timeoutMs || 10_000,
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /** Telesign takes form-encoded bodies and answers with JSON. */
  private async request<T = unknown>(endpoint: string, method: Method, body?: Record<string, string>): Promise<T> {
    try {
      const response = await this.client.request<T>({
        url: endpoint,
        method,
        data: body && new URLSearchParams(body).toString(),
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new TelesignError(error.response.status, error.response.status, error.message);
      }

      throw new Error('Telesign provider error', { cause: error });
    }
  }

  async sendSms(payload: SendSmsRequest) {
    const { to, text, senderId, messageType = TelesignMessageType.OTP } = payload;

    const body = {
      phone_number: to,
      message: text,
      message_type: messageType,
      ...(senderId ? { sender_id: senderId } : {}),
    };

    this.logger.log({ endpoint: TelesignEndpoint.SEND_SMS, body }, 'Telesign send sms request');
    const response = await this.request<SendSmsResponse>(TelesignEndpoint.SEND_SMS, 'POST', body);
    this.logger.log({ response }, 'Telesign send sms response');

    if (response.status?.code !== TELESIGN_MESSAGE_IN_PROGRESS || !response.reference_id) {
      throw new TelesignError(
        response.status?.code,
        HttpStatusCode.BadRequest,
        response.status?.description ?? 'SMS Failed',
      );
    }

    return { messageId: response.reference_id };
  }
}

/** Example
const sender = new TelesignApi({
  baseUrl: 'https://rest-api.telesign.com',
  customerId: 'xxxxx',
  apiKey: 'xxxxx',
});
 */
