import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { User } from './users.schema';
import { Document } from './documents.schema';
import { Comment } from './comments.schema';
import { Files } from './files.schema';

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
  direccionId: string;

  @Prop()
  departmentId: string;

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

  @Prop()
  pauseByDevolucion: number;

  @Prop()
  continueByDevolucion: number;

  @Prop({ default: 0 })
  devolucionTime: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Document.name })
  documentId: Document;

  @Prop({ default: StateEnum.pending })
  state: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }])
  comments: Comment[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Files.name }])
  files: Files[];
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
