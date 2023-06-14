import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DocumentSettingDocument = HydratedDocument<DocumentSetting>;

@Schema()
export class DocumentSetting {
  @Prop()
  previusDaysAfterRequest: number;
}

export const DocumentSettingSchema =
  SchemaFactory.createForClass(DocumentSetting);
