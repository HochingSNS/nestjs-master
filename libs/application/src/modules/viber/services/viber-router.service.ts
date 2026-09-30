import { Injectable } from '@nestjs/common';
import { Chance } from 'chance';
import { ViberRouteConfigWithAccount } from '../models/viber-route-config.model';

@Injectable()
export class ViberRouterService {
  constructor() {}

  routeTo(routeConfig: ViberRouteConfigWithAccount) {
    const chance = new Chance();
    const enabledAccounts = routeConfig.accounts.filter((acc) => acc.isEnabled);

    if (enabledAccounts.length === 0) return null;

    const selectedAccount = chance.weighted(
      enabledAccounts,
      enabledAccounts.map((acc) => acc.weight),
    );

    return selectedAccount.accountDetails;
  }
}
