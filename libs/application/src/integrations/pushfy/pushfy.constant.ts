/**
 * Pushfy API endpoints (OpenAPI 3.1.1)
 * https://portal.pushfy.com
 */
export const PushfyEndpoint = {
  SEND_SMS: '/webapi',
  BALANCE: '/balance',
} as const;

/** `status` returned by the balance endpoint on success. */
export const PUSHFY_SUCCESS_STATUS = 'success';
