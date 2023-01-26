import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

// SCHEMAS
import { Flujo } from '@/schemas/flujos.schema';
import { User } from '@/schemas/users.schema';
import { Activity } from '@/schemas/activities.schema';
import { Files } from './files.schema';

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

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
  participants: User[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }])
  activities: Activity[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Flujo.name })
  flujoId: Flujo;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Files.name }])
  files: Files[];

  @Prop()
  startedAt: Date;

  @Prop()
  endedAt: Date;
}

export const DocumentsSchema = SchemaFactory.createForClass(Document);
