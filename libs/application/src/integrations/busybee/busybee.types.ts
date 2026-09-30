export type ClientOptions = {
  baseUrl: string;
  clientId: string;
  apiKey: string;
  timeoutMs?: number;
};

export type SendSmsRequest = {
  to: string;
  text: string;
  senderId: string;
  /** Ask BusyBee to raise delivery receipts. Defaults to true, as in the legacy client. */
  registeredForDelivery?: boolean;
};

export type SendSmsResponse = {
  ErrorCode: number;
  ErrorDescription?: string;
  Data?: { MessageId: string; MessageErrorCode?: number }[];
};

export type BalanceResponse = {
  ErrorCode: number;
  ErrorDescription?: string;
  /** `Credits` arrives as a currency-prefixed string, e.g. `PHP1234.5`. */
  Data?: { Credits: string }[];
};
