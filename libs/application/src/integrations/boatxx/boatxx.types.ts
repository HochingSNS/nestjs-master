export type ClientOptions = {
  baseUrl: string;
  appKey: string;
  secretKey: string;
  timeoutMs?: number;
};

/**
 * Send SMS message — `application/x-www-form-urlencoded`
 */
export type SendSmsRequest = {
  to: string;
  text: string;
};

export type SendSmsResponse = {
  /** Localised result text, e.g. `请求成功`. */
  result?: string;
  code: string;
  messageid?: string;
};
