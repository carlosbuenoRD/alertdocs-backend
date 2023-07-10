import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Models

export type SolicitudesDocument = HydratedDocument<Solicitudes>;

@Schema({ timestamps: true })
export class Solicitudes {
  @Prop()
  type: string;

  @Prop()
  entity: string;

  @Prop()
  entityId: string;

  @Prop()
  userId: string;

  @Prop()
  justification: string;

  @Prop({ default: false })
  state: boolean;
}

export const SolicitudeSchema = SchemaFactory.createForClass(Solicitudes);
