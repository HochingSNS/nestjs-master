import { MessageType } from './email-log.model';
import { EmailAccount } from './email-account.model';

export type RouteType = MessageType;
export const RouteStrategy = ['RoundRobin', 'WeightedRobin'] as const;
export type RouteStrategy = (typeof RouteStrategy)[number];

type RouteAccount = {
  enabled: boolean;
  weight: number;
  account: EmailAccount;
};

export interface EmailRouteConfig {
  type: RouteType;
  platformId: string;
  strategy: RouteStrategy;
  accounts: RouteAccount[];
}
