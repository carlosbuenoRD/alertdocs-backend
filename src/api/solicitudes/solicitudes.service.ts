import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Model
import { Solicitudes, SolicitudesDocument } from './schema';

// DTOS
import { CreateSolicitudeDto } from './dto/create-solicitude.dto';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectModel(Solicitudes.name)
    private solicitudes: Model<SolicitudesDocument>,
  ) {}

  async create(createSolicitudeDto: CreateSolicitudeDto) {
    try {
      console.log('DTO', createSolicitudeDto);
      const createdSolicitud = await this.solicitudes.create(
        createSolicitudeDto,
      );
      console.log('DATA', createdSolicitud);
      return createdSolicitud;
    } catch (error) {
      console.log('CREATE SOLICITUD', error.message);
      return error.message;
    }
  }

  async findAll() {
    try {
      const solicitudes = await this.solicitudes.find();
      return solicitudes;
    } catch (error) {
      console.log('FIND SOLICITUD', error.message);
      return error.message;
    }
  }

  async findOne(id: string) {
    try {
      const solicitud = await this.solicitudes.findById(id);
      return solicitud;
    } catch (error) {
      console.log('FIND ID SOLICITUD', error.message);
      return error.message;
    }
  }
}
