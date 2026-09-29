import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RouteStrategy, RouteType } from '../models/viber-route-config.model';

export type ViberRouteConfigDocument = HydratedDocument<ViberRouteConfig>;

@Schema({ _id: false })
export class Account {
  @Prop({ type: Types.ObjectId, required: true })
  accountId: Types.ObjectId;

  @Prop({ type: Boolean, required: true })
  isEnabled: boolean;

  @Prop({ type: Number, required: true })
  weight: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

@Schema({ collection: 'viber_route_configs' })
export class ViberRouteConfig {
  @Prop({ type: String, enum: RouteType })
  type: RouteType;

  @Prop({ required: true })
  platformId: string;

  @Prop({ type: String, enum: RouteStrategy, required: true })
  strategy: RouteStrategy;

  @Prop({ type: AccountSchema, required: true })
  accounts: Account[];
}
export const ViberRouteConfigSchema = SchemaFactory.createForClass(ViberRouteConfig);
