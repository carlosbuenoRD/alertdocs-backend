import { CreateDocumentDto } from '@/api/documents/dto/create-document.dto';
import { User } from '@/schemas/users.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  acceptedBy: User;

  @Prop()
  justification: string;

  @Prop()
  state: boolean;

  @Prop()
  modify: CreateDocumentDto;
}

export const SolicitudeSchema = SchemaFactory.createForClass(Solicitudes);
