import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { Areas } from './areas.schema';

export type DireccionDocument = HydratedDocument<Direcciones>;

@Schema()
export class Direcciones {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Areas.name })
  areaId: Areas;
}

export const DireccionSchema = SchemaFactory.createForClass(Direcciones);
