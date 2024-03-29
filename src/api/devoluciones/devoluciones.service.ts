import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// DB
import { DevolucionDoc, Devolucion } from '@/schemas/devoluciones.schema';
import {
  Activity,
  ActivityDocument,
  StateEnum,
} from '@/schemas/activities.schema';

// DTO
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { ReportsService } from '../reports/reports.service';
// import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';

@Injectable()
export class DevolucionesService {
  constructor(
    @InjectModel(Devolucion.name) private devolucion: Model<DevolucionDoc>,
    @InjectModel(Activity.name) private activity: Model<ActivityDocument>,
    private reports: ReportsService,
  ) { }

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

      if (activityFrom.state !== StateEnum.ready) {
        activityFrom.pauseByDevolucion = Date.now();
        await activityFrom.save();
      }

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

  async findInProcess() {
    try {
      const devoluciones = await this.devolucion
        .find({ endedAt: { $exists: false } })

      return devoluciones;
    } catch (error) {
      console.log(error.message, 'DEVOLUCIONES: IN PROCESS');
      return error.message;
    }
  }


  async getUserDevolucionesCount(user: string) {
    let start = new Date(new Date(new Date().setDate(1))).setHours(0, 0, 0, 0);
    let end = new Date(new Date(new Date().setDate(30))).setHours(
      23,
      59,
      59,
      59,
    );

    try {
      return await this.devolucion
        .find({
          userTo: user,
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

  // By User
  async findByUser(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ userTo: id, endedAt: { $exists: false } })
        .populate('activityTo')
        .populate('userTo')
        .populate('activityFrom')
        .populate('userFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  // By Activity
  async findByActivity(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ activityTo: id })
        .populate('activityTo')
        .populate('userTo')
        .populate('activityFrom')
        .populate('userFrom');
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
        .populate('activityTo')
        .populate('userTo')
        .populate('activityFrom')
        .populate('userFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  // By Direccion
  async findByDireccion(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ direccion: id })
        .populate('activityTo')
        .populate('userTo')
        .populate('activityFrom')
        .populate('userFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  // By Department
  async findByDepartment(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ department: id })
        .populate('activityTo')
        .populate('userTo')
        .populate('activityFrom')
        .populate('userFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  // By flujo
  async findByFlujo(id: string) {
    try {
      const devolucion = await this.devolucion
        .find({ flujo: id })
        .populate('activityTo')
        .populate('userTo')
        .populate('activityFrom')
        .populate('userFrom');
      return devolucion;
    } catch (error) {
      return error.message;
    }
  }

  async endDevolucion(id: string) {
    try {
      // Looking for devolucion and adding ended time
      const devolucion = await this.devolucion.findById(id);
      devolucion.endedAt = Date.now();

      await devolucion.save();

      // Looking for activity to and adding the devolucion time
      const activityTo = await this.activity.findById(devolucion.activityTo);
      activityTo.devolucionTime += devolucion.endedAt - devolucion.startedAt;

      // looking for activity from and adding the time the devolucion over
      const activityFrom = await this.activity.findById(
        devolucion.activityFrom,
      );

      if (activityFrom.state !== StateEnum.ready) {
        activityFrom.continueByDevolucion = Date.now();
        await activityFrom.save();
      }

      // REPORT
      // Looking for exisiting report
      const report = await this.reports.findByArea(devolucion.area);

      // If exist adding activity info
      if (report) {
        await this.reports.update(report._id, devolucion, 'devolucion');
      } else {
        // If not exist creating report and adding devolucion info
        await this.reports.create({
          devoluciones: [devolucion._id],
          devolucionesTime: devolucion.endedAt - devolucion.startedAt,
          areaId: devolucion.area,
        });
      }

      await activityTo.save();
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  update(id: number, updateDevolucionDto: any) {
    return `This action updates a #${id} devolucion`;
  }

  remove(id: number) {
    return `This action removes a #${id} devolucion`;
  }
}
