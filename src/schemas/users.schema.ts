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
  direccion: string;

  @Prop()
  department: string;

  @Prop()
  cargo: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 'ninguno' })
  role: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  lunchTime: string;

  @Prop()
  profileImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
