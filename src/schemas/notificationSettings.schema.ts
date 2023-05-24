import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type NotificationSettingDocument = HydratedDocument<NotificationSetting>;

@Schema()
export class NotificationSetting {
  @Prop()
  name: string;

  @Prop()
  options: {
    name: string;
    message: string;
    keep: boolean;
    email: boolean;
  }[];
}

export const NotificationSettingSchema =
  SchemaFactory.createForClass(NotificationSetting);
