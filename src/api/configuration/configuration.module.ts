import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Models
import { DocumentSetting, DocumentSettingSchema } from '@/schemas/documentSettings.schema';
import { NotificationSetting, NotificationSettingSchema } from '@/schemas/notificationSettings.schema';

// Controller
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentSetting.name, schema: DocumentSettingSchema },
      { name: NotificationSetting.name, schema: NotificationSettingSchema }
    ])
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService]
})
export class ConfigurationModule { }
