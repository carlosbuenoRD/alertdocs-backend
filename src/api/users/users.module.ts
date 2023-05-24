// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { NotificationsModule } from '@/gateways/notifications/notifications.module';

// Schema
import { User, UserSchema } from '@/schemas/users.schema';
import {
  NotificationSetting,
  NotificationSettingSchema,
} from '@/schemas/notificationSettings.schema';

// Controller
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: NotificationSetting.name, schema: NotificationSettingSchema },
    ]),
    HttpModule,
    NotificationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
