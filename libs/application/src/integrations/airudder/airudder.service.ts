import { Logger } from '@nestjs/common';
import axios, { AxiosInstance, HttpStatusCode, Method, RawAxiosRequestHeaders } from 'axios';
import {
  AIRUDDER_SEND_SUCCESS_CODE,
  AIRUDDER_SUCCESS_CODE,
  AIRUDDER_TOKEN_TTL_SECONDS,
  AIRUDDER_UTC_OFFSET_MINUTES,
  AirudderEndpoint,
} from './airudder.constant';
import { AirudderError } from './airudder.error';
import {
  AuthResponse,
  ClientOptions,
  CreateWorkflowRequest,
  CreateWorkflowResponse,
  SendSmsRequest,
  SendSmsResponse,
  UploadWorkflowDetailsRequest,
  UploadWorkflowDetailsResponse,
} from './airudder.types';

/** Airudder wants `YYYY-MM-DD HH:mm:ss+08:00` regardless of where the process runs. */
function formatWorkflowTime(date: Date): string {
  const shifted = new Date(date.getTime() + AIRUDDER_UTC_OFFSET_MINUTES * 60_000);

  return `${shifted.toISOString().slice(0, 19).replace('T', ' ')}+08:00`;
}

export class AirudderApi {
  private readonly logger = new Logger(AirudderApi.name);
  private readonly client: AxiosInstance;
  private accessToken?: { value: string; expiresAt: number };

  constructor(private readonly options: ClientOptions) {
    this.client = axios.create({
      baseURL: this.options.baseUrl,
      timeout: this.options.timeoutMs || 10_000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async request<T = unknown>(
    endpoint: string,
    method: Method,
    body?: Record<string, unknown>,
    headers?: RawAxiosRequestHeaders,
  ): Promise<T> {
    try {
      const response = await this.client.request<T>({ url: endpoint, method, data: body, headers });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new AirudderError(error.response.status, error.response.status, error.message);
      }

      throw new Error('Airudder provider error', { cause: error });
    }
  }

  /**
   * Returns a cached token, fetching a new one once it ages out. Airudder's auth
   * response carries no expiry, so the lifetime is a local assumption — see
   * `AIRUDDER_TOKEN_TTL_SECONDS`. The cache lives on this instance, so share one
   * client per account to share the token.
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.accessToken.expiresAt > Date.now()) {
      return this.accessToken.value;
    }

    const body = { APPKey: this.options.appKey, APPSecret: this.options.appSecret };

    this.logger.log({ endpoint: AirudderEndpoint.AUTH, appKey: this.options.appKey }, 'Airudder token request');
    const response = await this.request<AuthResponse>(AirudderEndpoint.AUTH, 'POST', body);

    if (response.code !== AIRUDDER_SUCCESS_CODE || !response.data?.token) {
      throw new AirudderError(response.code, HttpStatusCode.Unauthorized, response.message ?? 'Airudder Token Failed');
    }

    const ttlSeconds = this.options.tokenTtlSeconds ?? AIRUDDER_TOKEN_TTL_SECONDS;
    this.accessToken = { value: response.data.token, expiresAt: Date.now() + ttlSeconds * 1000 };

    return response.data.token;
  }

  private async authHeaders(): Promise<RawAxiosRequestHeaders> {
    return { Authorization: `Bearer ${await this.getAccessToken()}` };
  }

  async sendSms(payload: SendSmsRequest) {
    const { to, text, senderId, callbackUrl, messageId } = payload;

    const body = {
      to: [to],
      message: text,
      from: senderId,
      ...(callbackUrl ? { callbackUrl } : {}),
    };

    this.logger.log({ messageId, endpoint: AirudderEndpoint.SEND_SMS, body }, 'Airudder send sms request');
    const response = await this.request<SendSmsResponse>(
      AirudderEndpoint.SEND_SMS,
      'POST',
      body,
      await this.authHeaders(),
    );
    this.logger.log({ messageId, response }, 'Airudder send sms response');

    if (response.code !== AIRUDDER_SEND_SUCCESS_CODE || !response.body?.messageId) {
      throw new AirudderError(response.code, HttpStatusCode.BadRequest, response.message ?? 'Airudder SMS Failed');
    }

    return { messageId: response.body.messageId };
  }

  /**
   * Opens a marketing workflow and seeds it with its first batch of recipients.
   * A workflow holds at most `AIRUDDER_WORKFLOW_MAX_DETAILS` recipients; rotating
   * to a new one is the caller's decision.
   */
  async createWorkflowInstance(payload: CreateWorkflowRequest) {
    const { templateId, name, endTime, details } = payload;

    const body = {
      workflow_template_id: templateId,
      name,
      end_time: formatWorkflowTime(endTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000)),
      details,
    };

    this.logger.log({ endpoint: AirudderEndpoint.CREATE_WORKFLOW, body }, 'Airudder create workflow request');
    const response = await this.request<CreateWorkflowResponse>(
      AirudderEndpoint.CREATE_WORKFLOW,
      'POST',
      body,
      await this.authHeaders(),
    );
    this.logger.log({ response }, 'Airudder create workflow response');

    if (response.code !== AIRUDDER_SUCCESS_CODE || !response.data?.workflow_id) {
      throw new AirudderError(
        response.code,
        HttpStatusCode.BadRequest,
        response.message ?? 'Airudder Workflow Create Failed',
      );
    }

    return { workflowId: response.data.workflow_id };
  }

  /** Appends recipients to a workflow opened earlier by `createWorkflowInstance`. */
  async uploadWorkflowDetails(payload: UploadWorkflowDetailsRequest) {
    const { workflowId, details } = payload;
    const body = { workflow_id: workflowId, details };

    this.logger.log({ endpoint: AirudderEndpoint.UPLOAD_WORKFLOW_DETAILS, body }, 'Airudder upload workflow request');
    const response = await this.request<UploadWorkflowDetailsResponse>(
      AirudderEndpoint.UPLOAD_WORKFLOW_DETAILS,
      'POST',
      body,
      await this.authHeaders(),
    );
    this.logger.log({ response }, 'Airudder upload workflow response');

    if (response.code !== AIRUDDER_SUCCESS_CODE) {
      throw new AirudderError(
        response.code,
        HttpStatusCode.BadRequest,
        response.message ?? 'Airudder Workflow Upload Details Failed',
      );
    }

    return { workflowId };
  }
}

/** Example
const sender = new AirudderApi({
  baseUrl: 'https://api.airudder.com',
  appKey: 'xxxxx',
  appSecret: 'xxxxx',
});
 */
