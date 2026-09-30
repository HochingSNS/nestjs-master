export type ClientOptions = {
  baseUrl: string;
  /** Organisation code, sent as `orgCode` and used as the first part of the signature. */
  orgCode: string;
  /** Shared secret, used only to build the request signature — never sent on the wire. */
  password: string;
  timeoutMs?: number;
};

/**
 * Send SMS message
 * https://apidoc.universeaction.com/web/#/20/2793
 */
export type SendSmsRequest = {
  to: string;
  text: string;
  /** Mapped to `oaNumber`. */
  senderId?: string;
  /** Delivery receipt webhook, mapped to `notifyUrl`. */
  callbackUrl?: string;
};

export type SendSmsResponse = {
  code: number;
  message?: string;
  data?: {
    sendCode: string;
  };
};
