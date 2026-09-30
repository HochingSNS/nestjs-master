/**
 * Telesign Messaging API endpoints
 */
export const TelesignEndpoint = {
  SEND_SMS: '/v1/messaging',
} as const;

/** `status.code` returned when a message is queued for delivery. */
export const TELESIGN_MESSAGE_IN_PROGRESS = 290;

/** Telesign classifies traffic for routing and compliance. */
export const TelesignMessageType = {
  OTP: 'OTP',
  ARN: 'ARN',
  MKT: 'MKT',
} as const;

export type TelesignMessageType = (typeof TelesignMessageType)[keyof typeof TelesignMessageType];
