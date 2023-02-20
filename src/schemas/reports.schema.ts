import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from './users.schema';
import { Activity } from './activities.schema';
import { Devolucion } from './devoluciones.schema';
import { Areas } from '@/schemas/areas.schema';

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }])
  activities: Activity[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }])
  goodActivities: Activity[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }])
  badActivities: Activity[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }])
  mediumActivities: Activity[];

  @Prop({ default: 0 })
  activitiesEficiencia: number;

  @Prop({ default: 0 })
  activitiesTime: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Devolucion.name }])
  devoluciones: Devolucion[];

  @Prop({ default: 0 })
  devolucionesTime: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Areas.name })
  areaId: string;

  @Prop()
  direccionId: string;

  @Prop()
  departmentId: string;

  @Prop({ default: new Date().getMonth() })
  month: number;

  @Prop({ default: new Date().getFullYear() })
  year: number;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
