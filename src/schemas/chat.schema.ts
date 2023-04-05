import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Models
import { Message } from './message.chema';
import { User } from './users.schema';

export type ChatDocument = HydratedDocument<Chats>;

@Schema({ timestamps: true })
export class Chats {
  @Prop()
  chatName: string;

  @Prop()
  isGroupChat: boolean;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
  users: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Message.name })
  latestMessage: Message;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  groupAdmin: User;
}

export const ChatSchema = SchemaFactory.createForClass(Chats);
