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

  async create(
    activity: IActivitiesDocument,
    documentId: any,
    flujoId: string,
  ) {
    try {
      const createdActivity = await this.activities.create({
        ...activity,
        usersId: activity.usersId[0],
        documentId,
        flujoId,
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
      return await this.activities.findById(id).populate('usersId');
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

  async findByDireccion(id: string) {
    try {
      return await this.activities.find({ direccionId: id });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByDepartment(id: string) {
    try {
      return await this.activities.find({ departmentId: id });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByDocument(id: string) {
    try {
      return await this.activities
        .find({ documentId: id })
        .sort({ step: 1 })
        .populate('usersId')
        .populate('files');
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByUserAndFlujo(flujo: string, user: string) {
    try {
      return await this.activities.find({ flujoId: flujo, usersId: user });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByAreaAndFlujo(flujo: string, area: string) {
    try {
      return await this.activities.find({ flujoId: flujo, areaId: area });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findCompletedByDocument(id: string) {
    try {
      const total = await this.activities.find({ documentId: id }).count();
      const done = await this.activities
        .find({ documentId: id, endedAt: { $exists: true } })
        .count();

      return {
        total,
        done,
      };
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findCompletedByArea(id: string) {
    try {
      // const total = await this.activities.find({ areaId: id }).count();
      const total = await this.activities
        .find({ areaId: id, endedAt: { $exists: true } })
        .count();

      return total;
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
    return await this.activities
      .find({
        usersId: id,
      })
      .populate('usersId');
  }

  async changeActivityState(id: string, state: string) {
    let activity = await this.activities.findById(id);

    activity.state = state;

    if (state === 'revision') {
      // Changing current activity state
      activity.endedAt = Date.now();

      // Looking for next activity in document
      const nextActivity = await this.activities.findOne({
        documentId: activity.documentId,
        step: activity.step + 1,
      });

      if (nextActivity) {
        // Changing next activity state
        nextActivity.state = StateEnum.progress;
        nextActivity.startedAt = Date.now();

        // Saving changes of next activity
        await nextActivity.save();
      }
    } else {
      activity.startedAt = Date.now();
    }

    await activity.save();
  }

  async updateActivityComments(id: string, comments: any) {
    const activity = await this.activities.findById(id);
    activity.comments.push(comments);
    return await activity.save();
  }

  async updateActivityFiles(id: string, path: any) {
    const activity = await this.activities.findById(id);
    activity.files.push(path);
    return await activity.save();
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

  // async remove(id: string) {
  //   return await this.activity.findByIdAndDelete(id);
  // }
}
