/**
 * Abosend SMS API endpoints
 * https://apidoc.universeaction.com/web/#/20/2793
 */
export const AbosendEndpoint = {
  SEND_SMS: '/v2/api/sendSMS',
} as const;

/** `code` returned on a successful send. */
export const ABOSEND_SUCCESS_CODE = 200;
