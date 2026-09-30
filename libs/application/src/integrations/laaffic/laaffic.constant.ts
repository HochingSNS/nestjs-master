/**
 * Laaffic SMS API endpoints
 * https://www.laaffic.com/api/sms/sendSms/
 */
export const LaafficEndpoint = {
  SEND_SMS: '/v3/sendSms',
} as const;

/** `status` returned on a successful send. */
export const LAAFFIC_SUCCESS_STATUS = '0';
