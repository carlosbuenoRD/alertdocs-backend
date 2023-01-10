import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from './users.schema';
import { Activity } from './activities.schema';
import { Document } from './documents.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User;
  @Prop()
  text: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Activities' })
  activityId: Activity;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Document.name })
  documentId: Document;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
