import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { Areas } from './areas.schema';
import { Direcciones } from './direcciones.schema';

export type DepartmentDocument = HydratedDocument<Departments>;

@Schema()
export class Departments {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Areas.name })
  areaId: Areas;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Direcciones.name })
  direccionId: Direcciones;
}

export const DepartmentSchema = SchemaFactory.createForClass(Departments);
