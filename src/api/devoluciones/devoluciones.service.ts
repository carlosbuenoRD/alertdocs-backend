import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// DB
import { DevolucionDoc, Devolucion } from '@/schemas/devoluciones.schema';
import { Activity, ActivityDocument } from '@/schemas/activities.schema';

// DTO
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';

@Injectable()
export class DevolucionesService {
  constructor(
    @InjectModel(Devolucion.name) private devolucion: Model<DevolucionDoc>,
    @InjectModel(Activity.name) private activity: Model<ActivityDocument>,
  ) {}

  async create(createDevolucioneDto: CreateDevolucioneDto) {
    try {
      const activityADevolver = await this.activity.findById(
        createDevolucioneDto.activityTo,
      );

      const newDevoluvion = await this.devolucion.create({
        ...createDevolucioneDto,
        userTo: activityADevolver.usersId,
        area: activityADevolver.areaId,
        direccion: activityADevolver.direccionId,
        department: activityADevolver.departmentId,
        startedAt: Date.now(),
      });

      // ACTIVITY FROM
      const activityFrom = await this.activity.findById(
        createDevolucioneDto.activityFrom,
      );
      activityFrom.pauseByDevolucion = Date.now();
      await activityFrom.save();

      return newDevoluvion;
    } catch (error) {
      return error.message;
    }
  }

  async findAll() {
    try {
      return await this.devolucion.find({});
    } catch (error) {
      return error.message;
    }
  }

  async findOne(id: string) {
    try {
      return await this.devolucion.findById(id);
    } catch (error) {
      return error.message;
    }
  }

  // By Activity
  async findByActivity(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ activityTo: id })
        .populate('userFrom')
        .populate('activityFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  // By Area
  async findByArea(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ area: id })
        .populate('userFrom')
        .populate('activityFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  // By Area
  async findByDireccion(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ direccion: id })
        .populate('userFrom')
        .populate('activityFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  // By Area
  async findByDepartment(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ department: id })
        .populate('userFrom')
        .populate('activityFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  async endDevolucion(id: string) {
    try {
      const devolucion = await this.devolucion.findById(id);
      devolucion.endedAt = Date.now();

      const activityTo = await this.activity.findById(devolucion.activityTo);
      activityTo.devolucionTime += devolucion.endedAt - devolucion.startedAt;

      const activityFrom = await this.activity.findById(
        devolucion.activityFrom,
      );

      activityFrom.continueByDevolucion = Date.now();

      await activityFrom.save();
      await activityTo.save();
      await devolucion.save();
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  update(id: number, updateDevolucionDto: UpdateDevolucioneDto) {
    return `This action updates a #${id} devolucion`;
  }

  remove(id: number) {
    return `This action removes a #${id} devolucion`;
  }
}
