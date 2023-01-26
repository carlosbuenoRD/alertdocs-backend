import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Model
import { User, UserDocument } from '@/schemas/users.schema';

// DTO
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private axios: HttpService,
    private jwt: JwtService,
    @InjectModel(User.name) private users: Model<UserDocument>,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    try {
      const { data } = await this.axios.axiosRef.post(
        'https://localhost:7197/api/login',
        { username: createAuthDto.username, password: createAuthDto.password },
      );

      const user = await this.users.findById('63cfd48a7fa2e7a5ae2d4ac6');
      if (!user) throw new Error('No puedes ingresar al sistema');

      let token: any = await this.jwt.sign({ id: user.id });

      return {
        name: user.name,
        _id: user._id,
        isAdmin: user.isAdmin,
        token,
      };
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
