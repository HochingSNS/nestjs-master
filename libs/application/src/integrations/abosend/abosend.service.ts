import { Logger } from '@nestjs/common';
import { createHash, randomInt } from 'node:crypto';
import axios, { AxiosInstance, HttpStatusCode, Method } from 'axios';
import { ABOSEND_SUCCESS_CODE, AbosendEndpoint } from './abosend.constant';
import { AbosendError } from './abosend.error';
import { ClientOptions, SendSmsRequest, SendSmsResponse } from './abosend.types';

export class AbosendApi {
  private readonly logger = new Logger(AbosendApi.name);
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
        throw new AbosendError(error.response.status, error.response.status, error.message);
      }

      throw new Error('Abosend provider error', { cause: error });
    }
  }

  /** `md5(orgCode + content + rand + password)`, uppercased. */
  private sign(text: string, rand: string): string {
    return createHash('md5')
      .update(this.options.orgCode + text + rand + this.options.password)
      .digest('hex')
      .toUpperCase();
  }

  async sendSms(payload: SendSmsRequest) {
    const { to, text, senderId, callbackUrl } = payload;
    const rand = randomInt(0, 1_000_000).toString().padStart(6, '0');

    const body = {
      orgCode: this.options.orgCode,
      mobiles: to,
      content: text,
      rand,
      sign: this.sign(text, rand),
      ...(callbackUrl ? { notifyUrl: callbackUrl } : {}),
      ...(senderId ? { oaNumber: senderId } : {}),
    };

    this.logger.log(
      { endpoint: AbosendEndpoint.SEND_SMS, body: { ...body, sign: undefined } },
      'Abosend send sms request',
    );
    const response = await this.request<SendSmsResponse>(AbosendEndpoint.SEND_SMS, 'POST', body);
    this.logger.log({ response }, 'Abosend send sms response');

    if (response.code !== ABOSEND_SUCCESS_CODE || !response.data?.sendCode) {
      throw new AbosendError(response.code, HttpStatusCode.BadRequest, response.message ?? 'SMS Failed');
    }

    return { messageId: response.data.sendCode };
  }
}

/** Example
const sender = new AbosendApi({
  baseUrl: 'https://api.universeaction.com',
  orgCode: 'xxxxx',
  password: 'xxxxx',
});
 */
