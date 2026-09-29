export type ClientOptions = {
  baseUrl: string;
  username: string;
  password: string;
  timeoutMs?: number;
};

/**
 * Send SMS message — `application/x-www-form-urlencoded`, plain text response.
 */
export type SendSmsRequest = {
  to: string;
  text: string;
  /** Mapped to `source`. */
  senderId: string;
  /** Delivery receipt webhook, mapped to `replyTo`. */
  callbackUrl?: string;
  /** Ask the gateway to raise delivery receipts. Defaults to true, as in the legacy client. */
  registered?: boolean;
};

export type QueryMessageRequest = {
  messageId: string;
};
