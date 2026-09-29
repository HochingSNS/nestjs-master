/**
 * BusyBee SMS API endpoints
 */
export const BusybeeEndpoint = {
  SEND_SMS: '/api/v2/SendSMS',
  BALANCE: '/api/v2/Balance',
} as const;

/** `ErrorCode` returned on success. */
export const BUSYBEE_SUCCESS_CODE = 0;
