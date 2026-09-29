import { Injectable } from '@nestjs/common';
import { ViberSenderFactory } from './viber-sender.factory';
import { ViberOtp } from '../models/viber-message.model';
import { ViberAccount } from '../models/viber-account.model';
import { ViberRouteConfigManager } from './viber-route-config.manager';
import { Chance } from 'chance';
@Injectable()
export class ViberSenderService {
  constructor(private readonly configManager: ViberRouteConfigManager) {}

  async dispatchViberMessage(message: ViberOtp, account: ViberAccount) {
    const sender = ViberSenderFactory.createSender(account);
    return sender.sendViberOtp(message);
  }

  async acceptOtpRequest(message: ViberOtp, platformId: string) {
    // validate dto
    // retrieve config

    const routeConfig = await this.configManager.getRouteConfig('OTP', platformId);
    // selected config (routing)
    if (routeConfig) {
      const accounts = routeConfig.accounts.filter((acc) => acc.isEnabled);

      if (accounts.length > 0) {
        const chance = new Chance();
        const routeTo = chance.weighted(
          accounts,
          accounts.map((acc) => acc.weight),
        );
      }
    }

    // publish to topic
  }

  async acceptMktRequest() {
    // validate dto
    // retrieve config
    const routes = this.configManager.getRouteConfig('NOTIF', '50');

    // selected config (routing)
    // publish to topic
  }

  async acceptNotifRequest() {
    // validate dto
    // retrieve config
    const routes = this.configManager.getRouteConfig('NOTIF', '50');

    // selected config (routing)
    // publish to topic
  }

  private async publishNewMessage() {}
  private async publishProcessedMessage() {}
}
