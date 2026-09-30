export type ClientOptions = {
  baseUrl: string;
  /** Bearer token issued by Pushfy. */
  token: string;
  timeoutMs?: number;
};

export type SendSmsRequest = {
  to: string;
  text: string;
  senderId: string;
  /** Caller reference echoed back by Pushfy, mapped to `ext_id`. */
  messageId?: string;
};

export type SendSmsResponse = {
  /** Number of destinations Pushfy accepted. */
  accepted?: number;
  rejected?: number;
  message_id?: string;
  error?: string;
};

export type BalanceResponse = {
  status: string;
  /** Remaining SMS credits — a count, not a currency amount. */
  balance?: number | string;
  error?: string;
};
