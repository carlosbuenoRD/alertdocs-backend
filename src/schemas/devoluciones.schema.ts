import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// Models
import { User } from './users.schema';
import { Activity } from './activities.schema';

export type DevolucionDoc = Devolucion & Document;

@Schema({ timestamps: true })
export class Devolucion {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Activity.name })
  activityFrom: Activity;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  activityTo: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userFrom: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userTo: User;

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
