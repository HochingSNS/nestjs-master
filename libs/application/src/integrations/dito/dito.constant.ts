/**
 * DITO A2P API endpoints
 */
export const DitoEndpoint = {
  SEND_SMS: '/a2p/api/v1/message/sendText',
  SEND_OTP: '/a2p/api/v1/message/sendOtpText',
  ACCESS_TOKEN: '/a2p/api/v1/access_token',
} as const;

/** `resultCode` returned on a successful send. */
export const DITO_SUCCESS_CODE = 0;

/** Seconds shaved off the token lifetime so it is refreshed before it expires. */
export const DITO_TOKEN_EXPIRY_SKEW_SECONDS = 60;
