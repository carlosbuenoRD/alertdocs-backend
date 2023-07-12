import { CreateDocumentDto } from '@/api/documents/dto/create-document.dto';
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

  @Prop()
  state: boolean;

  @Prop()
  modify: CreateDocumentDto;
}

export const SolicitudeSchema = SchemaFactory.createForClass(Solicitudes);
