import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ViberProviderCode } from '../models/viber-provider.model';

export type ViberProviderDocument = HydratedDocument<ViberProvider>;

@Schema({ collection: 'viber_providers', autoIndex: false })
export class ViberProvider {
  @Prop({ required: true })
  name: string;

  /**
   * Support multiple API URLs (Mock/Test/Account URL)
   */
  @Prop({ required: true })
  urls: string[];

  @Prop({ type: String, enum: ViberProviderCode, required: true })
  code: ViberProviderCode;
}
export const ViberProviderSchema = SchemaFactory.createForClass(ViberProvider);

ViberProviderSchema.index({ name: 1 }, { name: 'name', unique: true });
ViberProviderSchema.index({ name: 1, code: 1 }, { name: 'unique_provider', unique: true });
