/**
 * AIRUDDER API endpoints
 * https://api-docs.airudder.com
 */
export const AirudderEndpoint = {
  AUTH: '/service/cloud/auth',
  SEND_SMS: '/service/sms/message/v2/send',
  CREATE_WORKFLOW: '/service/cloud/workflow/createinstance',
  UPLOAD_WORKFLOW_DETAILS: '/service/cloud/workflow/uploaddetails',
} as const;

/** The transactional send endpoint answers `code: 0` on success. */
export const AIRUDDER_SEND_SUCCESS_CODE = 0;

/** Auth and workflow endpoints answer `code: 200` on success. */
export const AIRUDDER_SUCCESS_CODE = 200;

/** Airudder's auth response carries no expiry, so the token is cached for this long. */
export const AIRUDDER_TOKEN_TTL_SECONDS = 3600;

/** Workflow times are expected in Manila time. */
export const AIRUDDER_UTC_OFFSET_MINUTES = 8 * 60;

/** A single workflow instance accepts at most this many recipients. */
export const AIRUDDER_WORKFLOW_MAX_DETAILS = 10_000;
