import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  id: string;

  @Prop()
  area: string;

  @Prop()
  cargo: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 0 })
  isAdmin: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
