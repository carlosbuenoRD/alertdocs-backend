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
import { ReportsService } from '../reports/reports.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activities: Model<ActivityDocument>,
    private reports: ReportsService,
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
      console.log(error.message, 'ACTIVITY create');
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
      console.log(error.message, 'ACTIVITY find all');
      return error.message;
    }
  }

  async findByArea(id: string) {
    try {
      return await this.activities.find({ areaId: id });
    } catch (error) {
      console.log(error.message, 'ACTIVITY, find by area');
      return error.message;
    }
  }

  async findByFlujo(id: string) {
    try {
      return await this.activities.find({ flujoId: id });
    } catch (error) {
      console.log(error.message, 'ACTIVITY, find by area');
      return error.message;
    }
  }

  async findByDireccion(id: string) {
    try {
      return await this.activities.find({ direccionId: id });
    } catch (error) {
      console.log(error.message, 'ACTIVITY by direccion');
      return error.message;
    }
  }

  async findByDepartment(id: string) {
    try {
      return await this.activities.find({ departmentId: id });
    } catch (error) {
      console.log(error.message, 'ACTIVITY by department');
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
      console.log(error.message, 'ACTIVITY by document');
      return error.message;
    }
  }

  async findByUserAndFlujo(flujo: string, user: string) {
    try {
      return await this.activities.find({ flujoId: flujo, usersId: user });
    } catch (error) {
      console.log(error.message, 'ACTIVITY by user and flujo');
      return error.message;
    }
  }

  async findByAreaAndFlujo(flujo: string, area: string) {
    try {
      return await this.activities.find({ flujoId: flujo, areaId: area });
    } catch (error) {
      console.log(error.message, 'ACTIVITY area and flujo');
      return error.message;
    }
  }

  async findCompletedByDocument(id: any) {
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
      console.log(error.message, 'ACTIVITY completedByDocument');
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
      console.log(error.message, 'ACTIVITY completedByArea');
      return error.message;
    }
  }

  async findByDocumentAndArea(area: string, document: string) {
    try {
      return await this.activities.find({ documentId: document, areaId: area });
    } catch (error) {
      console.log(error.message, 'ACTIVITY document&area');
      return error.message;
    }
  }

  async findOne(id: string) {
    try {
      let activity = await this.activities.findById(id).populate('usersId');
      return activity;
    } catch (error) {
      console.log(error.message, 'ACTIVITY findone');
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
    try {
      let activity = await this.activities.findById(id);

      activity.state = state;

      if (state === 'revision') {
        // Changing current activity state
        activity.endedAt = Date.now();
        await activity.save();

        //Handling report data
        await this.reports.handleActivityReport(activity);

        // Looking for next activity in document
        const nextActivity = await this.activities.findOne({
          documentId: activity.documentId,
          step: activity.step + 1,
        });

        if (nextActivity) {
          // Changing next activity state
          nextActivity.state = StateEnum.ready;

          // Saving changes of next activity
          await nextActivity.save();
        } else {
          activity.state = StateEnum.completed;
          await activity.save();
        }

        // Looking for past activity in document
        const pastActivity = await this.activities.findOne({
          documentId: activity.documentId,
          step: activity.step - 1,
        });

        pastActivity.state = StateEnum.completed;

        await pastActivity.save();
      } else {
        activity.startedAt = Date.now();
        activity.state = StateEnum.progress;
        await activity.save();
      }
    } catch (error) {
      console.log(error.message, 'Change state');
    }
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

  // async isLastActivity(activity: Activity): Promise<boolean> {
  //   try {
  //     const answer = await this.activities.findOne({
  //       step: activity.step + 1,
  //       flujoId: activity.flujoId,
  //       documentId: activity.documentId,
  //     });

  //     answer ? false : true;
  //   } catch (error: any) {
  //     console.log(error.message, 'isLastActivity?');
  //     return error.message;
  //   }
  // }

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
