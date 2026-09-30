/**
 * Aliyun Dysmsapi (2018-05-01) — the international "send to globe" SMS API.
 * Calls go through the Alibaba Cloud SDK rather than a REST path, so there is
 * no endpoint map here; the endpoint host comes from `ClientOptions.endpoint`.
 */
export const ALIYUN_DEFAULT_REGION_ID = 'ap-southeast-1';

/** `responseCode` returned on a successful send. */
export const ALIYUN_SUCCESS_CODE = 'OK';

/** Aliyun routes on traffic type; the legacy client only ever sent these two. */
export const AliyunMessageType = {
  OTP: 'OTP',
  MARKETING: 'MKT',
} as const;

export type AliyunMessageType = (typeof AliyunMessageType)[keyof typeof AliyunMessageType];
