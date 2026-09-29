import { CACHE_TOKEN } from '@application/connnections';
import { Injectable, Inject, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ViberRouteConfig } from '../schemas/viber-route-config.schema';
import { RouteType } from '../models/viber-route-config.model';

const ConfigChannel = {
  Otp: 'viber.route-config.otp.updated',
  Mkt: 'viber.route-config.mkt.updated',
  Notif: 'viber.route-config.notif.updated',
} as const;

@Injectable()
export class ViberRouteConfigManager implements OnModuleDestroy {
  /**
   * Map<platformId, Map<RouteType, ViberRouteConfig>
   */
  private configMap: Map<string, Map<RouteType, ViberRouteConfig>>;
  private logger = new Logger(ViberRouteConfigManager.name);

  constructor(@Inject(CACHE_TOKEN.PRIMARY) private readonly redis: Redis) {
    redis.subscribe(ConfigChannel.Mkt);
    redis.subscribe(ConfigChannel.Otp);
    redis.subscribe(ConfigChannel.Notif);

    redis.on('message', (channel, message) => this.handleConfigUpdate(channel, message));
  }

  private async handleConfigUpdate(channel: string, platformId: string) {
    try {
      switch (channel) {
        case ConfigChannel.Mkt:
          await this.updateConfig('MKT', platformId);
          break;
        case ConfigChannel.Otp:
          await this.updateConfig('OTP', platformId);
          break;
        case ConfigChannel.Notif:
          await this.updateConfig('NOTIF', platformId);
          break;
      }
    } catch (err) {
      this.logger;
    }
  }

  private async updateConfig(routeType: RouteType, platformId: string) {}

  async getRouteConfig(routeType: RouteType, platformId: string) {
    const routeConfigMemory = this.configMap.get(platformId)?.get(routeType);
    if (routeConfigMemory) return routeConfigMemory;

    const routeConfigDb = await this.findAndUpdateConfigMemory(routeType, platformId);
    return routeConfigDb;
  }

  private async findAndUpdateConfigMemory(routeType: RouteType, platformId: string) {
    // retrieve from repository
    // update local config
    // return local config
  }

  async onModuleDestroy() {
    await this.redis.unsubscribe(ConfigChannel.Otp);
    await this.redis.unsubscribe(ConfigChannel.Mkt);
    await this.redis.unsubscribe(ConfigChannel.Notif);
  }
}
