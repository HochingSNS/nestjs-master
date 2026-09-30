import { Logger } from '@nestjs/common';
import Dysmsapi, { SendMessageToGlobeRequest } from '@alicloud/dysmsapi20180501';
import { Config } from '@alicloud/openapi-client';
import { RuntimeOptions } from '@alicloud/tea-util';
import { HttpStatusCode } from 'axios';
import { ALIYUN_DEFAULT_REGION_ID, ALIYUN_SUCCESS_CODE, AliyunMessageType } from './aliyun.constant';
import { AliyunError } from './aliyun.error';
import { ClientOptions, SendSmsRequest } from './aliyun.types';

export class AliyunApi {
  private readonly logger = new Logger(AliyunApi.name);
  private readonly client: Dysmsapi;

  constructor(private readonly options: ClientOptions) {
    this.client = new Dysmsapi(
      new Config({
        accessKeyId: this.options.accessKeyId,
        accessKeySecret: this.options.accessKeySecret,
        type: 'access_key',
        endpoint: this.options.endpoint,
        regionId: this.options.regionId ?? ALIYUN_DEFAULT_REGION_ID,
      }),
    );
  }

  async sendSms(payload: SendSmsRequest) {
    const { to, text, senderId, messageType = AliyunMessageType.OTP } = payload;

    const request = new SendMessageToGlobeRequest({
      to,
      message: text,
      from: senderId,
      type: messageType,
    });

    this.logger.log(
      { endpoint: this.options.endpoint, to, from: senderId, type: messageType },
      'Aliyun send sms request',
    );

    try {
      const response = await this.client.sendMessageToGlobeWithOptions(request, new RuntimeOptions({}));
      this.logger.log({ response: response.body }, 'Aliyun send sms response');

      if (response.body?.responseCode !== ALIYUN_SUCCESS_CODE || !response.body?.messageId) {
        throw new AliyunError(
          response.body?.responseCode ?? 'unknown',
          HttpStatusCode.BadRequest,
          response.body?.responseDescription ?? 'SMS Failed',
        );
      }

      return { messageId: response.body.messageId };
    } catch (error) {
      if (error instanceof AliyunError) throw error;

      throw new Error('Aliyun provider error', { cause: error });
    }
  }
}

/** Example
const sender = new AliyunApi({
  endpoint: 'dysmsapi.ap-southeast-1.aliyuncs.com',
  accessKeyId: 'xxxxx',
  accessKeySecret: 'xxxxx',
});
 */
