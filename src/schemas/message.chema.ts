import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { User } from './users.schema';
import { Chats } from './chat.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  sender: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chats' })
  chat: Chats;

  @Prop()
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
