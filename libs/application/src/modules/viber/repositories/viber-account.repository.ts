import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ViberAccountBase as ViberAccountBaseModel,
  ViberAccountApiToken as ViberAccountApiTokenModel,
  ViberAccountApiKeySecret as ViberAccountApiKeySecretModel,
  type ViberAccount as ViberAccountModel,
} from '../schemas/viber-account.schema';
import { ViberAccount, ViberAccountApiKey } from '../models/viber-account.model';
import { MONGO_CONN_NAME } from '@application/connnections';
import { Except } from 'type-fest';
import { Lean } from '@framework/mongoose';

@Injectable()
export class ViberAccountRepository {
  private logger = new Logger(ViberAccountRepository.name);
  constructor(
    @InjectModel(ViberAccountBaseModel.name, MONGO_CONN_NAME.PRIMARY)
    private accountModel: Model<ViberAccountBaseModel>,

    @InjectModel(ViberAccountApiTokenModel.name, MONGO_CONN_NAME.PRIMARY)
    private accountApiKeyModel: Model<ViberAccountApiTokenModel>,
  ) {}

  async getAllAccount(): Promise<ViberAccount[]> {
    const accounts = await this.accountModel.find().lean<Lean<ViberAccountModel>[]>();
    return accounts.map((acc) => ({ ...acc, id: acc._id.toString() }));
  }

  async addApiKeyAccount(account: Except<ViberAccountApiKey, 'id' | 'createdAt' | 'updatedAt'>) {
    const acc = new this.accountApiKeyModel({
      name: account.name,
      senderIds: account.senderIds,
      providerCode: account.providerCode,
      apiKey: account.apiToken,
      url: account.url,
      type: 'ApiToken',
    });

    await acc.save();
  }

  async onModuleInit() {
    await this.addApiKeyAccount({
      type: 'ApiToken',
      apiToken: 'ewewewew',
      providerCode: 'Infobip',
      name: 'test account laide',
      url: 'https://blastoice.com',
      senderIds: ['CasinoPlus'],
    });
    const accounts = await this.accountApiKeyModel.find().lean<Lean<ViberAccountModel>[]>();
    this.logger.log({ accounts }, 'accounts');
  }
}
