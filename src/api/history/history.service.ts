import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Services
import { ActivitiesService } from '../activities/activities.service';

// SCHEMA
import { History, HistoryDocument } from '@/schemas/history.schema';
import { SolicitudHistory, SolicitudHistoryDocument } from '@/schemas/solicitudHistory.schema';

// DTOS
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private history: Model<HistoryDocument>,
    @InjectModel(SolicitudHistory.name) private solicitudHistory: Model<SolicitudHistoryDocument>,
    private activityService: ActivitiesService,
  ) { }

  async create(createHistoryDto: CreateHistoryDto) {
    try {
      let newAction = {
        userId: createHistoryDto.userId,
        action: createHistoryDto.action,
        createdAt: Date.now(),
      };

      const history = await this.findOne(createHistoryDto.activityId);

      if (!history) {
        const createdHistory = await this.history.create({
          ...createHistoryDto,
          actions: [newAction],
        });
        return createdHistory;
      } else {
        history.actions.push(newAction);
        await history.save();
        return history;
      }
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findOne(id) {
    try {
      const history = await this.history.findOne({ activityId: id });
      return history;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByDocument(id) {
    try {
      const histories = await this.history.find({ documentId: id });
      return histories;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByActivity(id) {
    try {
      const activity = await this.activityService.findOne(id);
      const histories = await this.history
        .find({
          documentId: activity.documentId,
          step: { $lt: activity.step + 1 },
        })
        .sort({ step: -1 });


      return histories;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  // SOLICITUD HISTORY

  async createSolicitudHistory(createHistoryDto: CreateHistoryDto) {
    try {
      let newAction = {
        userId: createHistoryDto.userId,
        action: createHistoryDto.action,
        createdAt: Date.now(),
      };

      const history = await this.solicitudHistory.findOne({ solicitudId: createHistoryDto.solicitudId });

      if (!history) {
        const createdHistory = await this.solicitudHistory.create({
          ...createHistoryDto,
          actions: [newAction],
        });
        return createdHistory;
      } else {
        history.actions.push(newAction);
        await history.save();
        return history;
      }
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findBySolicitud(id) {
    try {
      const histories = await this.solicitudHistory.find({ solicitudId: id });
      return histories;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
