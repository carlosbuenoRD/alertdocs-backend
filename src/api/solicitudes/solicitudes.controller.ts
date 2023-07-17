import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateSolicitudeDto } from './dto/create-solicitude.dto';
import { SolicitudesService } from './solicitudes.service';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) { }

  @Post()
  async create(@Body() createSolicitudeDto: CreateSolicitudeDto) {
    try {
      return this.solicitudesService.create(createSolicitudeDto);
    } catch (error) {
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll(@Query() query: any) {
    try {
      return this.solicitudesService.findAll(query);
    } catch (error) {
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.solicitudesService.findOne(id);
    } catch (error) {
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('monitor/:id')
  findByMonitor(@Param('id') id: string) {
    try {
      return this.solicitudesService.findByMonitor(id);
    } catch (error) {
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  changeState(@Param('id') id: string, @Body() body: any) {
    try {
      return this.solicitudesService.changeState(id, body);
    } catch (error) {
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
