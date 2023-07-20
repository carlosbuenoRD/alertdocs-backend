import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { User } from './users.schema';
import { Areas } from './areas.schema';

export type FlujoDocument = HydratedDocument<Flujo>;

@Schema()
export class Flujo {
  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop()
  descriptions: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Areas.name }])
  areas: Areas[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
  participants: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: User;

  @Prop(
    raw([
      {
        areaId: { type: String },
        direccionId: { type: String },
        departmentId: { type: String },
        description: { type: String },
        hours: { type: Number },
        step: { type: Number },
        libramiento: { type: Boolean },
        usersId: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
      },
    ]),
  )
  activitiesSchema: Record<string, any>;
}

export const FlujoSchema = SchemaFactory.createForClass(Flujo);
