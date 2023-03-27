import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Models
import { Chats, ChatSchema } from '@/schemas/chat.schema';
import { User, UserSchema } from '@/schemas/users.schema';

// Controller
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chats.name, schema: ChatSchema }, { name: User.name, schema: UserSchema }])],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule { }
