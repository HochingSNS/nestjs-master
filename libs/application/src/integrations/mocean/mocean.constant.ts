/**
 * MoceanAPI endpoints
 */
export const MoceanEndpoint = {
  SEND_SMS: '/rest/2/sms',
  BALANCE: '/rest/2/account/balance',
} as const;

/** `status` returned on success, both for sends and for balance lookups. */
export const MOCEAN_SUCCESS_STATUS = 0;
