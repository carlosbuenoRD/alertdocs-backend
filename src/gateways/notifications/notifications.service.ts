import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  Notification,
  NotificationDocument,
} from '@/schemas/notification.schema';

// DTOS
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notifications: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      let exist = await this.notifications.findOne({
        user: createNotificationDto.user,
      });

      if (!exist) {
        await this.notifications.create({
          user: createNotificationDto.user,
          notifications: [
            {
              message: createNotificationDto.message,
              from: createNotificationDto.from,
            },
          ],
        });
      } else {
        exist.notifications.unshift({
          message: createNotificationDto.message,
          from: createNotificationDto.from,
        });
        await exist.save();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(user: string) {
    try {
      const notifications = await this.notifications
        .findOne({ user })
        .select('notifications');
      return notifications;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addDocumentParticipants(participants: string[]) {
    try {
      participants.forEach(async (p) => {
        await this.create({
          user: p,
          message:
            'Has sido agregado a un documento, Mantente alerta a tu turno!',
          from: 'me',
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
