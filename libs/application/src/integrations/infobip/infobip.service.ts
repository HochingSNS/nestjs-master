import { Logger } from '@nestjs/common';
import axios, { AxiosInstance, HttpStatusCode, Method } from 'axios';
import { InfobipEndpoint, InfobipErrorId } from './infobip.constant';
import { InfobipError } from './infobip.error';
import { ClientOptions, InfobipErrorResponse, SendSmsRequest, SendSmsResponse } from './infobip.types';

/** Statuses where Infobip returns a `requestError` envelope worth surfacing as an InfobipError. */
const HANDLED_ERROR_STATUSES: number[] = [
  HttpStatusCode.BadRequest,
  HttpStatusCode.Unauthorized,
  HttpStatusCode.Forbidden,
  HttpStatusCode.TooManyRequests,
];

export class InfobipApi {
  private readonly logger = new Logger(InfobipApi.name);
  private readonly client: AxiosInstance;

  constructor(private readonly options: ClientOptions) {
    this.client = axios.create({
      baseURL: this.options.baseUrl,
      timeout: this.options.timeoutMs || 10_000,
      headers: {
        Authorization: `App ${this.options.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  private async request<T = unknown>(endpoint: string, method: Method, body?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.request<T>({
        url: endpoint,
        method,
        data: body,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError<InfobipErrorResponse>(error) && error.response) {
        const { serviceException } = error.response.data?.requestError ?? {};

        if (HANDLED_ERROR_STATUSES.includes(error.response.status)) {
          throw new InfobipError(
            serviceException?.messageId ?? InfobipErrorId.GENERAL_ERROR,
            error.response.status,
            serviceException?.text ?? error.message,
            serviceException?.validationErrors,
          );
        }
      }

      throw new Error('Infobip provider error', { cause: error });
    }
  }

  async sendSms(payload: SendSmsRequest) {
    const { from, to, text, messageId } = payload;

    const body = {
      messages: [
        {
          sender: from,
          destinations: [{ to }],
          content: { text },
          ...(messageId ? { messageId } : {}),
        },
      ],
    };

    this.logger.log({ messageId, endpoint: InfobipEndpoint.SEND_SMS, body }, 'Infobip send sms request');
    const response = await this.request<SendSmsResponse>(InfobipEndpoint.SEND_SMS, 'POST', body);
    this.logger.log({ messageId, response }, 'Infobip send sms response');

    const [message] = response.messages ?? [];

    if (!response.bulkId || !message?.messageId) {
      throw new InfobipError(InfobipErrorId.GENERAL_ERROR, HttpStatusCode.BadRequest, 'SMS Failed');
    }

    return message;
  }
}

/** Example
const sender = new InfobipApi({
  baseUrl: 'https://xxxxx.api.infobip.com',
  apiKey: 'xxxxx',
});
 */
