import { Logger } from '@nestjs/common';
import axios, { AxiosInstance, HttpStatusCode, Method } from 'axios';
import { M360_SUCCESS_CODE, M360Endpoint } from './m360.constant';
import { M360Error } from './m360.error';
import { ClientOptions, SendSmsRequest, SendSmsResponse } from './m360.types';

export class M360Api {
  private readonly logger = new Logger(M360Api.name);
  private readonly client: AxiosInstance;

  constructor(private readonly options: ClientOptions) {
    this.client = axios.create({
      baseURL: this.options.baseUrl,
      timeout: this.options.timeoutMs || 10_000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async request<T = unknown>(endpoint: string, method: Method, body?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.request<T>({ url: endpoint, method, data: body });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new M360Error(error.response.status, error.response.status, error.message);
      }

      throw new Error('M360 provider error', { cause: error });
    }
  }

  async sendSms(payload: SendSmsRequest) {
    const { to, text, senderId } = payload;

    const body = {
      app_key: this.options.appKey,
      app_secret: this.options.appSecret,
      msisdn: to,
      content: text,
      shortcode_mask: senderId,
    };

    this.logger.log(
      { endpoint: M360Endpoint.SEND_SMS, body: { ...body, app_secret: undefined } },
      'M360 send sms request',
    );
    const response = await this.request<SendSmsResponse>(M360Endpoint.SEND_SMS, 'POST', body);
    this.logger.log({ response }, 'M360 send sms response');

    if (response.code !== M360_SUCCESS_CODE || !response.messageId) {
      throw new M360Error(response.code, HttpStatusCode.BadRequest, response.message ?? 'SMS Failed');
    }

    return { messageId: response.messageId };
  }
}

/** Example
const sender = new M360Api({
  baseUrl: 'https://api.m360.com.ph',
  appKey: 'xxxxx',
  appSecret: 'xxxxx',
});
 */
