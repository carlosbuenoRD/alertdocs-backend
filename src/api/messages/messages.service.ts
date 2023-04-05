import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// MODELS
import { Message, MessageDocument } from '@/schemas/message.chema';
import { Chats, ChatDocument } from '@/schemas/chat.schema';
import { User, UserDocument } from '@/schemas/users.schema';

// DTOS
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messages,
    @InjectModel(Chats.name) private chats,
    @InjectModel(User.name) private users,
  ) {}

  async createMessage(req) {
    console.log(req.body);

    try {
      const newMessage = {
        sender: req.user._id,
        content: req.body.content,
        chat: req.body.chat,
      };

      let message = await this.messages.create(newMessage);

      message = await message.populate('sender', 'name pic');
      message = await message.populate('chat');
      message = await this.users.populate(message, {
        path: 'chat.users',
        select: 'name pic',
      });

      await this.chats.findByIdAndUpdate(req.body.chat, {
        latestMessage: message,
      });

      return message;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMessages(req) {
    try {
      const messages = await this.messages
        .find({ chat: req.params.id })
        .populate('sender', 'name pic');

      return messages;
    } catch (error) {
      console.log('GET MESSAGES ERROR: ', error.message);
      throw new Error(error.message);
    }
  }
}
