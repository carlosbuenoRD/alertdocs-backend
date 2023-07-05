import { Body, Controller, Get, HttpException, Param, Post, HttpStatus } from '@nestjs/common';
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
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  findAll() {
    try {
      return this.solicitudesService.findAll();
    } catch (error) {
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.solicitudesService.findOne(id);
    } catch (error) {
      new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
