import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

// Model
import { Chats, ChatDocument } from '@/schemas/chat.schema';
import { User, UserDocument } from '@/schemas/users.schema';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {

  constructor(@InjectModel(Chats.name) private Chat: Model<ChatDocument>,
    @InjectModel(User.name) private User: Model<UserDocument>
  ) { }

  accessChat = async (req, res) => {
    const { userId } = req.body

    try {
      if (!userId) {
        throw new Error('No user chat selected')
      }

      let isChat: any = await this.Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate('users', '-password')
        .populate('latestMessage')

      isChat = await this.User.populate(isChat, {
        path: 'lastestMessage.sender',
        select: 'name pic email',
      })

      if (isChat.length > 0) {
      } else {
        const newChat = await this.Chat.create({
          chatName: 'sender',
          isGroupChat: false,
          users: [req.user._id, userId],
        })

        const fullchat = await this.Chat.findById(newChat._id).populate(
          'users',
          '-password'
        )

        return fullchat
      }
    } catch (error) {
      throw new Error(error.message);

    }
  }

  getAllChats = async (req, res) => {
    try {
      const Chats = await this.Chat.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })

      let chats = await this.User.populate(Chats, {
        path: 'latestMessage.sender',
        select: 'name pic email',
      })

      return chats

    } catch (error) {
      console.log(error)
    }
  }

  createGroupChat = async (req, res) => {
    let { users, name } = req.body

    console.log(users, 1)

    if (!users || !name) {
    }

    users.push(req.user._id)
    console.log(users, 2)

    if (users.length <= 2) {
      throw new Error('More than 2 users are required to form a group chat!');
    }

    try {
      const createdGroup = await this.Chat.create({
        chatName: name,
        users,
        isGroupChat: true,
        groupAdmin: req.user._id,
      })

      let fullGroupChat = await this.Chat.findById(createdGroup._id)
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

      return fullGroupChat

    } catch (error) {
      throw new Error(error.message);

    }
  }

  renameGroupChat = async (req, res) => {
    const { chatId, name } = req.body

    if (!name) {
    }
    try {
      const updatedGroup = await this.Chat.findByIdAndUpdate(
        chatId,
        {
          chatName: name,
        },
        {
          new: true,
        }
      )
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

      if (!updatedGroup) {
        throw new Error('Chat group dosent exist')
      }

      return updatedGroup

    } catch (error) {
      throw new Error(error.message);

    }
  }

  removeToGroup = async (req, res) => {
    const { chatId, userId } = req.body

    try {
      const removed = await this.Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

      if (!removed) {
        throw new Error('Chat not found!')
      }

      return removed
    } catch (error) {
      throw new Error(error.message);

    }
  }

  addToGroup = async (req, res) => {
    const { chatId, userId } = req.body

    try {
      const added = await this.Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

      if (!added) {
        throw new Error('Chat not found!')
      }

      return added
    } catch (error) {
      throw new Error(error.message);

    }
  }
}
