import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { User } from './users.schema';
import { Document } from './documents.schema';

export enum StateEnum {
  'pending' = 'pending',
  'progress' = 'progress',
  'revition' = 'revition',
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
  startedAt: Date;

  @Prop()
  endedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Document.name })
  documentId: Document;

  @Prop({ default: StateEnum.pending })
  state: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
