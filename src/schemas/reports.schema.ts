import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from './users.schema';
import { Activity } from './activities.schema';
import { Devolucion } from './devoluciones.schema';
import { Areas } from '@/schemas/areas.schema';
import { Flujo } from '@/schemas/flujos.schema';

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

  @Prop(
    raw([
      {
        proceso: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Flujo.name,
        },
        qty: { type: Number, default: 1 },
        eficiencia: { type: Number, require: false },
      },
    ]),
  )
  procesos: any[];

  @Prop({ default: 0 })
  activitiesTime: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Devolucion.name }])
  devoluciones: Devolucion[];

  @Prop({ default: 0 })
  devolucionesTime: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Areas.name })
  areaId: Areas;

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
