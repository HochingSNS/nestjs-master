/**
 * Semaphore API endpoints
 */
export const SemaphoreEndpoint = {
  /** Suffixed with the message path, see `SemaphoreMessagePath`. */
  SEND_SMS: '/api/v4',
  BALANCE: '/api/v4/account',
} as const;

/**
 * Semaphore exposes one send path per traffic type. The OTP path asks for the
 * code to be passed separately so it can be substituted into the template.
 */
export const SemaphoreMessagePath = {
  MESSAGES: 'messages',
  OTP: 'otp',
  PRIORITY: 'priority',
} as const;

export type SemaphoreMessagePath = (typeof SemaphoreMessagePath)[keyof typeof SemaphoreMessagePath];

/** Statuses Semaphore reports for a message that will never be delivered. */
export const SEMAPHORE_FAILED_STATUSES = ['Failed', 'Refunded'];
