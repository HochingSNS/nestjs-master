import { ViberAccount } from '../models/viber-account.model';
import { MessageType } from './viber-log.model';

export type RouteType = MessageType;
export const RouteType = MessageType;

export const RouteStrategy = ['RoundRobin', 'WeightRobin'] as const;
export type RouteStrategy = (typeof RouteStrategy)[number];

export type RouteAccount = ViberAccount & {
  isEnabled: string;
  weight: number;
};

export interface ViberRouteConfig {
  type: RouteType;
  platformId: string;
  senderId: string;
  strategy: RouteStrategy;
  accounts: RouteAccount[];
}
