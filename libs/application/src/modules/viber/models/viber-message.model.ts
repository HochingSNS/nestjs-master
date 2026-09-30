export type ViberOtp = {
  messageId: string;
  otp: string;
  ttl: number;
  templateId: string;
  senderId: string;
};

export type SendViberResult = {
  referenceId: string;
  messageId: string;
};

export type ViberTemplateMessage = {
  id: string;
  params: Record<string, string>;
};

export const ViberMessageComponent = ['text', 'button', 'video', 'file', 'image'] as const;
export type ViberMessageComponent = (typeof ViberMessageComponent)[number];

const ViberMessageContent = {
  TextOnly: ['text'],
  TextImage: 
} as const satisfies Record<string, ViberMessageComponent[]>;
