/**
 * Boatxx SMS API endpoints (http://api.wftqm.com)
 */
export const BoatxxEndpoint = {
  SEND_SMS: '/api/sms/mtsend',
} as const;

/** `code` returned on a successful send. */
export const BOATXX_SUCCESS_CODE = '0';
