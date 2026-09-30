import { ViberAccount } from './viber-account.model';
import { MessageType } from './viber-log.model';
import { Except } from 'type-fest';
import { ViberProviderCode } from './viber-provider.model';

export type RouteType = MessageType;
export const RouteType = MessageType;

export const RouteStrategy = ['RoundRobin', 'WeightRobin'] as const;
export type RouteStrategy = (typeof RouteStrategy)[number];

export type RouteAccount = {
  id: string;
  isEnabled: boolean;
  weight: number;
};

export type RouteAccountDetails = RouteAccount & {
  accountDetails: Except<ViberAccount, 'id' | 'createdAt' | 'updatedAt'>;
};

export interface ViberRouteConfig {
  id: string;
  type: RouteType;
  platformId: string;
  senderId: string;
  strategy: RouteStrategy;
  accounts: RouteAccount[];
}

/**
 * Full route config with provider accounts
 */
export type ViberRouteConfigWithAccount = Except<ViberRouteConfig, 'accounts'> & {
  accounts: RouteAccountDetails[];
};

/**
 * Topic name for message queue
 */
export const ViberRouteTopicName = {
  'Infobip.Mkt': 'viber.mkt.infobip',
  'Infobip.Notif': 'viber.notif.infobip',
  'Infobip.Otp': 'viber.notif.infobip',
  'Promotexter.Mkt': 'viber.mkt.promotexter',
  'Promotexter.Otp': 'viber.otp.promotexter',
  'Promotexter.Notif': 'viber.notif.promotexter',
  'PromotexterApix.Mkt': 'viber.mkt.promotexter-apix',
  'PromotexterApix.Otp': 'viber.otp.promotexter-apix',
  'PromotexterApix.Notif': 'viber.notif.promotexter-apix',
} as const satisfies Record<`${ViberProviderCode}.${RouteType}`, `viber.${Lowercase<RouteType>}.${string}`>;
