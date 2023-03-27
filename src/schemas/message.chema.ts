
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema';

// Models

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  sender: User

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Message.name })
  chat: Message

  @Prop()
  content: string
}

export const Messagechema = SchemaFactory.createForClass(Message);
