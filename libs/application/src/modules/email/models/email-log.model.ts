import { EmailProviderCode } from './email-provider.model';

export const RequestStatus = ['Processing', 'Success', 'Failed'] as const;
export type RequestStatus = (typeof RequestStatus)[number];

export const DeliveryStatus = ['Pending', 'Delivered', 'Failed'] as const;
export type DeliveryStatus = (typeof DeliveryStatus)[number];

export const MessageType = ['Otp', 'Mkt', 'Notif'] as const;
export type MessageType = (typeof MessageType)[number];

export interface EmailLog {
  id: string;
  providerCode: EmailProviderCode;
  type: MessageType;
  refId: string;
  content: string;
  platformId?: string;
  playerId?: string;
  emailAddress: string;
  requestStatus: RequestStatus;
  deliveryStatus: DeliveryStatus;
  campaignId?: string;
  campaignSender?: string;
  createdAt: Date;
  updatedAt: Date;
}
