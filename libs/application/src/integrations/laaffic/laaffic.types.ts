export type ClientOptions = {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  timeoutMs?: number;
};

export type SendSmsRequest = {
  to: string;
  text: string;
  /** Laaffic application id, mapped to `appId`. */
  appId: string;
  /** Display sender, mapped to `senderId`. */
  senderName?: string;
  /** Caller reference echoed back by Laaffic, mapped to `orderId`. */
  messageId?: string;
};

export type SendSmsResponse = {
  status: string;
  reason?: string;
  array?: { msgId: string; number?: string }[];
};
