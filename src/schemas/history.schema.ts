import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from './users.schema';
import { Activity } from './activities.schema';
import { Document } from './documents.schema';

export type HistoryDocument = HydratedDocument<History>;

@Schema({ timestamps: true })
export class History {
  @Prop([
    {
      action: { type: String },
      createdAt: { type: Date, default: Date.now() },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: User.name },
    },
  ])
  actions;
  @Prop()
  step: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' })
  activityId: Activity;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Document.name })
  documentId: Document;
}

export const HistorySchema = SchemaFactory.createForClass(History);
