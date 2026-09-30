/**
 * Infobip SMS API endpoints
 * https://www.infobip.com/docs/api/channels/sms
 */
export const InfobipEndpoint = {
  SEND_SMS: '/sms/3/messages',
} as const;

/**
 * `requestError.serviceException.messageId` values returned by Infobip.
 * Not exhaustive — errors are classified by HTTP status first, this is for logging/branching.
 */
export const InfobipErrorId = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  GENERAL_ERROR: 'GENERAL_ERROR',
} as const;

export type InfobipErrorId = (typeof InfobipErrorId)[keyof typeof InfobipErrorId] | (string & {});

/**
 * Message status groups returned on send and on delivery reports.
 * https://www.infobip.com/docs/essentials/response-status-and-error-codes
 */
export const InfobipStatusGroup = {
  ACCEPTED: 0,
  PENDING: 1,
  UNDELIVERABLE: 2,
  DELIVERED: 3,
  EXPIRED: 4,
  REJECTED: 5,
} as const;

export type InfobipStatusGroup = (typeof InfobipStatusGroup)[keyof typeof InfobipStatusGroup];
