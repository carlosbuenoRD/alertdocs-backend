import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Models
import {
  Notification,
  NotificationSchema,
} from '@/schemas/notification.schema';

import {
  NotificationSetting,
  NotificationSettingSchema,
} from '@/schemas/notificationSettings.schema';

// Controller
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { EmailService } from './email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationSetting.name, schema: NotificationSettingSchema },
    ]),
  ],
  providers: [NotificationsGateway, NotificationsService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
