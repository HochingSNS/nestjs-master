/**
 * Mocean accepts either a bearer token or an api key/secret pair carried in the payload.
 */
export type AuthConfigBearerToken = {
  type: 'bearer_token';
  token: string;
};

export type AuthConfigApiKey = {
  type: 'api_key';
  apiKey: string;
  apiSecret: string;
};

export type ClientOptions = {
  baseUrl: string;
  timeoutMs?: number;
  auth: AuthConfigApiKey | AuthConfigBearerToken;
};

export type SendSmsRequest = {
  to: string;
  text: string;
  /** Mapped to `mocean-from`. */
  senderId: string;
  /** Delivery receipt webhook, mapped to `mocean-dlr-url`. */
  callbackUrl?: string;
};

export type SendSmsResponse = {
  messages?: {
    status: number;
    msgid?: string;
    receiver?: string;
    err_msg?: string;
  }[];
};

export type BalanceResponse = {
  status: number;
  value?: string;
  err_msg?: string;
};
