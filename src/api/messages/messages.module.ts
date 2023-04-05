import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Models
import { Chats, ChatSchema } from '@/schemas/chat.schema';
import { Message, MessageSchema } from '@/schemas/message.chema';
import { User, UserSchema } from '@/schemas/users.schema';

// Controller
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Chats.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
