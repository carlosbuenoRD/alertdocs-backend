import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { User } from './users.schema';
import { Activity } from './activities.schema';
import { Document } from './documents.schema';

export type FileDocument = HydratedDocument<Files>;

@Schema()
export class Files {
  @Prop()
  file: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User;
  v;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' })
  activityId: Activity;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'documents' })
  documentId: Document;
}

export const FilesSchema = SchemaFactory.createForClass(Files);
