export type ClientOptions = {
  baseUrl: string;
  appKey: string;
  appSecret: string;
  timeoutMs?: number;
};

export type SendSmsRequest = {
  to: string;
  text: string;
  /** Mapped to `shortcode_mask`. */
  senderId: string;
};

export type SendSmsResponse = {
  code: number;
  message?: string;
  messageId?: string;
};
