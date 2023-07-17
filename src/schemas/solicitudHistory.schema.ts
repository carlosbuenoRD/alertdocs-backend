import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Solicitudes } from '@/api/solicitudes/schema';
import { User } from './users.schema';

export type SolicitudHistoryDocument = HydratedDocument<SolicitudHistory>;

@Schema({ timestamps: true })
export class SolicitudHistory {
  @Prop([
    {
      action: { type: String },
      createdAt: { type: Date, default: Date.now() },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: User.name },
    },
  ])
  actions;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Solicitudes.name })
  solicitudId: Solicitudes;
}

export const SolicitudHistorySchema = SchemaFactory.createForClass(SolicitudHistory);
