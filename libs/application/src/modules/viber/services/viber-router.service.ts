import { Injectable } from '@nestjs/common';
import { Chance } from 'chance';
@Injectable()
class ViberRouterService {
  constructor() {
    const chance = new Chance();
    chance.weighted;
  }
}
