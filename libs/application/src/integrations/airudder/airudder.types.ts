export type ClientOptions = {
  baseUrl: string;
  /** Sent as `APPKey`. */
  appKey: string;
  /** Sent as `APPSecret`. */
  appSecret: string;
  timeoutMs?: number;
  /** Overrides `AIRUDDER_TOKEN_TTL_SECONDS` for the in-memory token cache. */
  tokenTtlSeconds?: number;
};

export type AuthResponse = {
  code: number;
  message?: string;
  data?: { token: string };
};

/**
 * Transactional send
 */
export type SendSmsRequest = {
  to: string;
  text: string;
  /** Mapped to `from`. */
  senderId: string;
  /** Delivery receipt webhook. */
  callbackUrl?: string;
  /** Caller reference used for log correlation only. */
  messageId?: string;
};

export type SendSmsResponse = {
  code: number;
  message?: string;
  body?: { messageId: string };
};

/**
 * Marketing workflows — recipients are uploaded in batches rather than sent one by one.
 */
export type WorkflowDetail = {
  /** Recipient in E.164 form, including the leading `+`. */
  callee: string;
  variables: Record<string, string>;
};

export type CreateWorkflowRequest = {
  templateId: number;
  name: string;
  /** Defaults to 24 hours from now. */
  endTime?: Date;
  details: WorkflowDetail[];
};

export type CreateWorkflowResponse = {
  code: number;
  message?: string;
  data?: { workflow_id: string };
};

export type UploadWorkflowDetailsRequest = {
  workflowId: string;
  details: WorkflowDetail[];
};

export type UploadWorkflowDetailsResponse = {
  code: number;
  message?: string;
};
