import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Models

export type AreaDocument = HydratedDocument<Areas>;

@Schema()
export class Areas {
  @Prop()
  name: string;
}

export const AreaSchema = SchemaFactory.createForClass(Areas);
