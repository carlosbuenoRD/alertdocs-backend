import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// GUARD
import { JwtAuthGuard } from '../auth/jwt.guard';

// SERVICE
import { UsersService } from './users.service';

// DTO
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Request() req) {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/monitors')
  async findMonitors() {
    try {
      return await this.usersService.findMonitors();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/config/lunchtime')
  async setLunchTime(@Body('time') time: number, @Request() req) {
    try {
      return await this.usersService.setLunchTime(req.user._id, time);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    try {
      return await this.usersService.findById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/find/search')
  async findBySearch(@Query() query) {
    try {
      return await this.usersService.findBySearch(query.search);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/area/:id')
  async findByArea(@Param('id') id: string) {
    try {
      return await this.usersService.findByArea(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/direccion/:id')
  async findByDireccion(@Param('id') id: string) {
    try {
      return await this.usersService.findByDireccion(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/department/:id')
  async findByDepartment(@Param('id') id: string) {
    try {
      return await this.usersService.findByDepartment(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() data) {
    try {
      return await this.usersService.updateUser(id, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Notifications

  @Get('/notifications/:id')
  async findNotifications(@Param('id') id: string) {
    try {
      return await this.usersService.getNotifications(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/notifications/config/settings')
  async findNotificationSettings() {
    try {
      return await this.usersService.getNotificationSettings();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/notifications/config/settings')
  async updateNotificationSetting(@Body() settings) {
    try {
      return await this.usersService.updateNotificationSettings(settings);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
