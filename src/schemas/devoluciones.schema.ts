import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document as Doc } from 'mongoose';

// Models
import { User } from './users.schema';
import { Activity } from './activities.schema';
import { Flujo } from './flujos.schema';
import { Document } from './documents.schema';

export type DevolucionDoc = Devolucion & Doc;

@Schema({ timestamps: true })
export class Devolucion {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Activity.name })
  activityFrom: Activity;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Activity.name })
  activityTo: Activity;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userFrom: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userTo: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Flujo.name })
  flujo: Flujo;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Document.name })
  document: Document;

  @Prop()
  comment: string;

  @Prop()
  missing: [string];

  @Prop()
  area: string;

  @Prop()
  direccion: string;

  @Prop()
  department: string;

  @Prop()
  startedAt: number;

  @Prop()
  endedAt: number;
}

export const DevolucionSchema = SchemaFactory.createForClass(Devolucion);
