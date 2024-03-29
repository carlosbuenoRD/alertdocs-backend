import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const cron = require('node-cron');

// Schema
import {
  Activity,
  ActivityDocument,
  StateEnum,
} from '@/schemas/activities.schema';
import { Document, DocumentsDoc } from '@/schemas/documents.schema';

// INTERFACE
import { ReportsService } from '../reports/reports.service';
import { User } from '../users/entities/user.entity';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { IActivity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activities: Model<ActivityDocument>,
    @InjectModel(Document.name) private documents: Model<DocumentsDoc>,
    private reports: ReportsService,
  ) {
    cron.schedule('26 16 * * *', async () => {
      try {
        await this.activities.updateMany(
          { endedAt: { $exists: false } },
          { pauseByEndDay: Date.now() },
        );

        console.log('ALL TASKS HAVE BEEN PAUSED');
      } catch (error: any) {
        console.log(error.message);
      }
    });

    cron.schedule('30 9 * * 1-5', async () => {
      try {
        await this.activities.updateMany(
          { pauseByEndDay: { $exists: true } },
          { continueByStartDay: Date.now() },
        );

        console.log('ALL TASKS HAVE BEEN RESUME');
      } catch (error: any) {
        console.log(error.message);
      }
    });
  }

  async create(activities) {
    try {
      const createdActivity = await this.activities.create(activities);
      return createdActivity;
    } catch (error) {
      console.log(error.message, 'ACTIVITY create');
      return error.message;
    }
  }

  async findAll() {
    return await this.activities.find();
  }

  async updateActivities(activities: IActivity[]) {
    try {
      activities.forEach(async (item) => {
        await this.activities.findByIdAndUpdate(item._id, {
          description: item.description,
          hours: item.hours,
        });
      });
    } catch (error) {
      console.log(error.message, 'ACTIVITY UPDATE');
      return error.message;
    }
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

      // Looking for next activity in document
      const nextActivity = await this.activities.findOne({
        documentId: activity.documentId,
        step: activity.step + 1,
      });

      if (state === 'progress') {
        if (nextActivity) {
          // Changing next activity state
          nextActivity.state = StateEnum.proximo;

          // Saving changes of next activity
          await nextActivity.save();
        }
      }

      if (state === 'revision') {
        // Changing current activity state
        activity.endedAt = Date.now();
        await activity.save();

        //Handling report data
        await this.reports.handleActivityReport(activity);

        if (nextActivity) {
          // Changing next activity state
          nextActivity.state = StateEnum.ready;

          // Saving changes of next activity
          await nextActivity.save();
        } else {
          activity.state = StateEnum.completed;

          const document = await this.documents.findById(activity.documentId);
          document.endedAt = Date.now();

          await document.save();
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

  async getUserActivitiesCount(user: string) {
    let start = new Date(new Date(new Date().setDate(1))).setHours(0, 0, 0, 0);
    let end = new Date(new Date(new Date().setDate(30))).setHours(
      23,
      59,
      59,
      59,
    );

    try {
      return await this.activities
        .find({
          usersId: user,
          endedAt: {
            $gte: start,
            $lt: end,
          },
        })
        .count();
    } catch (error) {
      console.log(error.message, 'ACTIVITY document&area');
      return error.message;
    }
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    return await this.activities.findByIdAndUpdate(id, updateActivityDto);
  }

  async selectUserByWorkLoad(users: User[]) {
    console.log('Select user Users', users);
    try {
      let curr: any = {};
      for (let i = 0; i < users.length; i++) {
        let activities = await this.activities.find({
          usersId: users[i]._id,
          endedAt: { $exists: false },
        });

        console.log(users[i].name, activities.length);
        console.log('FOR USER', users[i]);
        console.log('FOR INDEX', i);

        if (i > 0) {
          if (activities.length < curr?.qty) {
            curr.qty = activities.length;
            curr.index = i;
          }
        } else {
          curr.qty = activities.length;
          curr.index = i;
        }
      }
      console.log('SELECTED USER', users[curr.index]);
      return users[curr.index]?._id;
    } catch (error) {
      return error.message;
    }
  }

  async deleteActivitiesByDocument(id: string) {
    try {
      await this.activities.deleteMany({ documentId: id });
      console.log(`ACTIVITIES FROM DOCUMENT ${id.toUpperCase()} DELETED!`);
    } catch (error: any) {
      console.log('ERROR DELETING DOCUMENT ACTIVITIES', error.message);
    }
  }
  async updateActivitiesByDocument(activities: IActivity[]) {
    console.log('UPDATE ACTIVITIES', activities);
    try {
      for (let index = 0; index < activities.length; index++) {
        const element = activities[index];

        await this.activities.findByIdAndUpdate(element._id, element);
      }
      console.log(`UPDATE ACTIVITIES FROM DOCUMENT!`);
    } catch (error: any) {
      console.log('ERROR DELETING DOCUMENT ACTIVITIES', error.message);
    }
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

  // async remove(id: string) {
  //   return await this.activity.findByIdAndDelete(id);
  // }
}
