/**
 * M360 (Globe Labs) SMS API endpoints
 */
export const M360Endpoint = {
  SEND_SMS: '/v3/api/broadcast',
} as const;

/** `code` returned when a broadcast is created. */
export const M360_SUCCESS_CODE = 201;
