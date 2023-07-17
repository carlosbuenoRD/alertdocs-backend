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
  ) { }

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

  async findAll(query: any) {

    const { active, type } = query

    let queryDb: any = {}

    if (active && active !== 'Todos') queryDb.state = { $exists: active === 'Activos' ? false : true }
    if (type) queryDb.type = { $in: type.toLowerCase()?.split(',') }

    try {
      const solicitudes = await this.solicitudes.find({ ...queryDb }).populate('userId', 'name _id');
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

  async findByMonitor(id: string) {
    try {
      const solicitudes = await this.solicitudes.find({ acceptedBy: id });
      return solicitudes;
    } catch (error) {
      console.log('FIND BY MONITOR SOLICITUD', error.message);
      return error.message;
    }
  }

  async changeState(id: string, data: { state: boolean, acceptedBy: string }) {
    try {
      const solicitud = await this.solicitudes.findByIdAndUpdate(id, { state: data.state, acceptedBy: data.acceptedBy });
      return solicitud;
    } catch (error) {
      console.log('FIND ID SOLICITUD', error.message);
      return error.message;
    }
  }

  async deleteByEntity(id: string) {
    try {
      await this.solicitudes.deleteMany({ state: { $exists: false }, entityId: id });

    } catch (error) {
      console.log('DELETE MANY ENTITY', error.message);
      return error.message;
    }
  }
}
