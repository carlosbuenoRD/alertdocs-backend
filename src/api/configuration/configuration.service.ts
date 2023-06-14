import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// DB MODEL
import { Model } from 'mongoose';
import {
  NotificationSetting,
  NotificationSettingDocument,
} from '@/schemas/notificationSettings.schema';
import {
  DocumentSetting,
  DocumentSettingDocument,
} from '@/schemas/documentSettings.schema';

// DTOS
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {

  constructor(
    @InjectModel(NotificationSetting.name)
    private notificationSetting: Model<NotificationSettingDocument>,

    @InjectModel(DocumentSetting.name)
    private documentSetting: Model<DocumentSettingDocument>,
  ) { }

  async updateDaysPrevRequest(id: string, days: number) {
    try {
      const updatedDaysPrevRequest = await this.documentSetting.findByIdAndUpdate(id, { previusDaysAfterRequest: days })
      return updatedDaysPrevRequest
    } catch (error) {
      return error.message
    }
  }

  async findDocumentSetting() {
    try {
      const documentSetitng = await this.documentSetting.find()
      return documentSetitng
    } catch (error) {
      return error.message
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} configuration`;
  }

  update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    return `This action updates a #${id} configuration`;
  }

  remove(id: number) {
    return `This action removes a #${id} configuration`;
  }
}
