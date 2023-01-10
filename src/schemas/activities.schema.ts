import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { User } from './users.schema';
import { Document } from './documents.schema';
import { Comment } from './comments.schema';

export enum StateEnum {
  'pending' = 'pending',
  'progress' = 'progress',
  'revision' = 'revision',
  'completed' = 'completed',
}

export type ActivityDocument = HydratedDocument<Activity>;

@Schema()
export class Activity {
  @Prop()
  areaId: string;

  @Prop()
  description: string;

  @Prop()
  hours: number;

  @Prop()
  step: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  usersId: User;

  @Prop()
  startedAt: number;

  @Prop()
  endedAt: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Document.name })
  documentId: Document;

  @Prop({ default: StateEnum.pending })
  state: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }])
  comments: Comment[];
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
