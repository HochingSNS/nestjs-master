export type ClientOptions = {
  baseUrl: string;
  appId: string;
  appSecret: string;
  timeoutMs?: number;
};

export type SendSmsRequest = {
  to: string;
  text: string;
  /** Mapped to `serviceNo`. */
  senderId: string;
  /** Caller reference used for log correlation only; DITO does not echo it. */
  messageId?: string;
};

export type SendSmsResponse = {
  resultCode: number;
  errorMessage?: string;
  messageId?: string;
};

export type AccessTokenResponse = {
  accessToken?: string;
  /** Token lifetime in seconds. */
  expires?: number;
};
