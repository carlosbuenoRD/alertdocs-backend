import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Models
import { Notification, NotificationSchema } from '@/schemas/notification.schema'

// Controller
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule { }
