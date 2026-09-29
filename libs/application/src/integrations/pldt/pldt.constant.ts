/**
 * PLDT / SMART HTTP gateway endpoints
 */
export const PldtEndpoint = {
  SEND_SMS: '/cgphttp/servlet/sendmsg',
  QUERY_MESSAGE: '/cgphttp/servlet/querymsg',
} as const;

/** The gateway answers in plain text; this prefix marks an accepted message. */
export const PLDT_SUCCESS_RESPONSE = '0 001 OK';

/** `replyToTON` value the gateway expects for a URL callback. */
export const PLDT_REPLY_TO_TON_URL = 10;
