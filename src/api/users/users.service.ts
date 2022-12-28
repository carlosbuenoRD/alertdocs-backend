import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';

// DB MODEL
import { Model } from 'mongoose';
import { User, UserDocument } from '@/schemas/users.schema';

// DTOS
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private user: Model<UserDocument>,
    private readonly axios: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(String(createUserDto.id));

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

  async findAll() {
    try {
      const { data } = await this.axios.axiosRef.get(
        'https://localhost:7197/api/login',
      );
      const users = await this.user.find({ active: true });

      return {
        activeUsers: users,
        users: data.users,
      };
    } catch (error) {
      return error.message;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByArea(id: string) {
    console.log(id);

    try {
      const users = await this.user.find({ area: id, active: true });
      return users;
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
