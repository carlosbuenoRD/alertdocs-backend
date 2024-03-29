import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// DB MODEL
import { Model } from 'mongoose';
import { User, UserDocument } from '@/schemas/users.schema';
import {
  NotificationSetting,
  NotificationSettingDocument,
} from '@/schemas/notificationSettings.schema';

// DTOS
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationsService } from '@/gateways/notifications/notifications.service';

let options = [
  {
    area: '63cf2cc63212c419f6c80c9c',
    direcciones: [
      {
        id: '63cf30543586fe279271788c',
        departments: [
          '63cfcfbe1abd4e5e9fcce4e2',
          '63cfcfbe1abd4e5e9fcce4e3',
          '63cfcfbe1abd4e5e9fcce4e4',
        ],
      },
      {
        id: '63cf30543586fe279271788d',
        departments: ['63cfcf761abd4e5e9fcce4dc'],
      },
    ],
  },
  {
    area: '63cf2cc63212c419f6c80c9b',
    direcciones: [
      {
        id: '63cf2fd356a9a71bc27cbf68',
        departments: [''],
      },
      {
        id: '63cf2fd356a9a71bc27cbf6d',
        departments: [''],
      },
    ],
  },
];

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private user: Model<UserDocument>,
    private notificationsService: NotificationsService,
    @InjectModel(NotificationSetting.name)
    private notificationSetting: Model<NotificationSettingDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.id) {
        const user = await this.user.findOne({ id: String(createUserDto.id) });

        if (!user) {
          let createdUser = await this.user.create(createUserDto);
          return createdUser;
        } else {
          user.active = !user.active;
          await user.save();
          return 'Usuario desabilitado';
        }
      }
    } catch (error) {
      return error.message;
    }
  }

  // async findAll() {
  //   try {
  //     const { data } = await this.axios.axiosRef.get(
  //       'https://localhost:7197/api/login',
  //     );
  //     // const users = await this.user.find({ active: true });

  //     data.users.map((user) => {
  //       let areaProfile = options[Math.floor(Math.random() * 2)];
  //       let dire = Math.floor(Math.random() * 2);
  //       this.create({
  //         ...user,
  //         department:
  //           areaProfile.direcciones[dire].departments[
  //             Math.floor(Math.random() * 3)
  //           ],
  //         direccion: areaProfile.direcciones[dire].id,
  //         area: areaProfile.area,
  //       });
  //     });

  //     return {
  //       // activeUsers: users,
  //       users: data.users,
  //     };
  //   } catch (error) {
  //     return error.message;
  //   }
  // }

  async findAll() {
    try {
      const user = await this.user.find();
      return user;
    } catch (error) {
      return error.message;
    }
  }

  async findMonitors() {
    try {
      const user = await this.user.find({ role: 'monitor' });
      return user;
    } catch (error) {
      return error.message;
    }
  }

  async findById(id: string) {
    try {
      const user = await this.user.findById(id);
      return user;
    } catch (error) {
      return error.message;
    }
  }

  async setLunchTime(user: string, time: number) {
    try {
      const usersUpdated = await this.user.findById(user);
      usersUpdated.lunchTime = time;
      await usersUpdated.save();
      return usersUpdated;
    } catch (error) {
      console.log('SETTING LUCHTIME', error.message);
      return error.message;
    }
  }

  async findBySearch(search: string) {
    try {
      const user = await this.user
        .find({ name: { $regex: search, $options: 'i' } })
        .limit(5);
      return user;
    } catch (error) {
      return error.message;
    }
  }

  async findByArea(id: string) {
    try {
      const users = await this.user.find({ area: id });
      return users;
    } catch (error) {
      return error.message;
    }
  }

  async findByDireccion(direccion: string) {
    try {
      const users = await this.user.find({ direccion });
      return users;
    } catch (error) {
      return error.message;
    }
  }
  async findByDepartment(department: string) {
    try {
      const users = await this.user.find({ department });
      return users;
    } catch (error) {
      return error.message;
    }
  }

  async updateUser(
    id: string,
    data: { active: boolean; role: string; isAdmin: boolean },
  ) {
    console.log(id);
    try {
      const users = await this.user.findByIdAndUpdate(id, data);
      return users;
    } catch (error) {
      return error.message;
    }
  }

  // NOTIFICATIONS
  async getNotifications(user: string) {
    try {
      const notifications = await this.notificationsService.findAll(user);
      return notifications;
    } catch (error) {
      return error.message;
    }
  }

  async getNotificationSettings() {
    try {
      const notifications = await this.notificationSetting.find();
      return notifications;
    } catch (error) {
      return error.message;
    }
  }

  async updateNotificationSettings(settings: any) {
    try {
      settings.map(async (i) => {
        await this.notificationSetting.findByIdAndUpdate(i._id, i);
      });
    } catch (error) {
      return error.message;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
