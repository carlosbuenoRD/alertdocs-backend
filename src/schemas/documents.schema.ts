import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

// SCHEMAS
import { Flujo } from '@/schemas/flujos.schema';
import { User } from '@/schemas/users.schema';
import { Activity } from '@/schemas/activities.schema';
import { Files } from './files.schema';

export interface ClientProps {
  name: string;
  cedula_rnc: string;
  concepto: string;
}

export type DocumentsDoc = HydratedDocument<Document>;

@Schema({ timestamps: true })
export class Document {
  @Prop()
  transcode: string;

  @Prop()
  areas: [string];

  @Prop()
  direcciones: [string];

  @Prop()
  departments: [string];

  @Prop()
  libramiento: string;

  @Prop()
  description: string;

  @Prop()
  subprocess: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
  participants: User[];

  @Prop(
    raw([
      {
        areaId: { type: String },
        direccionId: { type: String },
        departmentId: { type: String },
        description: { type: String },
        hours: { type: Number },
        step: { type: Number },
        usersId: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
      },
    ]),
  )
  activities: Record<string, any>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Flujo.name })
  flujoId: Flujo;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Files.name }])
  files: Files[];

  @Prop()
  startedAt: number;

  @Prop()
  endedAt: number;

  @Prop()
  clients: ClientProps[];
}

export const DocumentsSchema = SchemaFactory.createForClass(Document);
