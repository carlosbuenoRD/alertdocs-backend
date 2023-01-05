import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Schema
import {
  Activity,
  ActivityDocument,
  StateEnum,
} from '@/schemas/activities.schema';

// INTERFACE
import { IActivitiesDocument } from '@/interfaces/activities.interface';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activities: Model<ActivityDocument>,
  ) {}

  async create(activity: IActivitiesDocument, documentId: any) {
    try {
      const createdActivity = await this.activities.create({
        ...activity,
        usersId: activity.usersId[0],
        documentId,
      });
      return createdActivity;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findAll() {
    return await this.activities.find();
  }

  async findOneActivity(id: string) {
    try {
      return await this.activities.findById(id);
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByArea(id: string) {
    try {
      return await this.activities.find({ areaId: id });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByDocument(id: string) {
    try {
      return await this.activities.find({ documentId: id }).populate('usersId');
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByDocumentAndArea(area: string, document: string) {
    try {
      return await this.activities.find({ documentId: document, areaId: area });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findOne(id: string) {
    try {
      let activity = await this.activities.findById(id);
      return activity;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findMyActitvities(id: string) {
    return await this.activities.find({
      usersId: id,
    });
  }

  async startMyActivity(id: string, state: string) {
    let activity = await this.activities.findById(id);

    if (activity.step === 1) {
      activity.state = state;
      return await activity.save();
    } else {
      let pastActivity = await this.activities.findOne({
        documentId: activity.documentId,
        step: activity.step - 1,
      });
      pastActivity.state = StateEnum.completed;
      activity.state = state;

      await pastActivity.save();
      await activity.save();
      return;
    }
  }

  // async findHistory(id: string) {
  //   let activity = await this.activities.findById(id);
  //   let history = await this.activities
  //     .find({
  //       activities: activity.activities,
  //       step: { $lt: activity.step },
  //     })
  //     .select('history step')
  //     .sort({ step: -1 });
  //   return history;
  // }

  // async addActivityHistory(info: any) {
  //   let activity = await this.activities.findById(info.activityId);
  //   activity.history.push({ ...info, createdAt: new Date() });
  //   return await activity.save();
  // }

  // async update(id: string, updateActivityDto: UpdateActivityDto) {
  //   return await this.activity.findByIdAndUpdate(id, updateActivityDto);
  // }

  // async updateActivityComments(id: string, comments: string) {
  //   const activity = await this.activities.findById(id);
  //   activity.comments.push(comments);
  //   return await activity.save();
  // }

  // async remove(id: string) {
  //   return await this.activity.findByIdAndDelete(id);
  // }
}
