import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

// Schema
import { Report, ReportDocument } from '@/schemas/reports.schema';
import { Activity, ActivityDocument } from '@/schemas/activities.schema';

// DTOS
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { addingTypeReportDto } from './dto/adding-type.dto';
import { getEficiencia } from '@/utils/formula';
import { CreateDocumentDto } from './../documents/dto/create-document.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private report: Model<ReportDocument>,
  ) {}

  dateQuery = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  async create(createReportDto: CreateReportDto) {
    try {
      let createdReport = await this.report.create(createReportDto);

      if (createReportDto.activities[0]) {
        this.chooseActivityType(
          createdReport,
          createReportDto.activitiesEficiencia,
          createReportDto.activities[0],
        );

        await createdReport.save();
      }

      return createdReport;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findAll() {
    try {
      let reports = await this.report
        .find(this.dateQuery)
        .populate('areaId', 'name');

      return reports;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findOne(id: string) {
    try {
      let report = await this.report
        .findById(id)
        .populate('areaId', 'name')
        .populate('procesos.proceso', 'description');
      return report;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByArea(id: string): Promise<ReportDocument> {
    try {
      let report = await this.report
        .findOne({
          areaId: id,
          ...this.dateQuery,
        })
        .populate('areaId', 'name')
        .populate('procesos.proceso', 'description');
      return report;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async handleActivityReport(activity: ActivityDocument): Promise<void> {
    try {
      // Looking for existing report
      const areaReport = await this.findByArea(activity.areaId);
      // const userReport = await this.findByUser(activity.usersId);

      // If exist adding activity info
      if (areaReport) {
        await this.update(`${areaReport._id}`, activity, 'activity');
      } else {
        // If not exist creating report and adding activity info
        await this.create({
          activities: [activity._id],
          activitiesTime: activity.endedAt - activity.startedAt,
          activitiesEficiencia: getEficiencia([activity]),
          areaId: activity.areaId,
        });
      }

      // if (userReport) {
      //   await this.update(`${userReport._id}`, activity, 'activity');
      // } else {
      //   // If not exist creating report and adding activity info
      //   await this.create({
      //     activities: [activity._id],
      //     activitiesTime: activity.endedAt - activity.startedAt,
      //     activitiesEficiencia: getEficiencia([activity]),
      //     user: activity.usersId,
      //   });
      // }
    } catch (error) {
      console.log(error.message, 'handleActivityReport');
      return error.message;
    }
  }

  async findByUser(id: any): Promise<ReportDocument> {
    try {
      let report = await this.report
        .findOne({
          user: id,
          ...this.dateQuery,
        })
        .populate('user', 'name');
      return report;
    } catch (error) {
      console.log(error.message, 'findByUser');
      return error.message;
    }
  }

  async update(id: any, item: any, type: string) {
    try {
      let report = await this.report.findById(id);

      if (type === 'activity') {
        let eficiencia = getEficiencia([item]);
        report.activities.push(item._id);
        report.activitiesTime += item.endedAt - item.startedAt;
        report.activitiesEficiencia += eficiencia;
        this.chooseActivityType(report, eficiencia, item);
      }

      if (type === 'devolucion') {
        report.devoluciones.push(item._id);
        report.devolucionesTime += item.endedAt - item.startedAt;
      }

      await report.save();
      return report;
    } catch (error) {
      console.log(error.message, 'Adding type report');
      return error.message;
    }
  }

  chooseActivityType(report: Report, eficiencia: number, item: any) {
    if (eficiencia > 120) report.goodActivities.push(item);
    if (eficiencia > 99 && eficiencia < 120) report.mediumActivities.push(item);
    if (eficiencia < 100) report.badActivities.push(item);
  }

  async handleReportProceso(proceso: CreateDocumentDto) {
    try {
      let report: ReportDocument;
      proceso.areas.map(async (a) => {
        report = await this.findByArea(a);

        // CHECK IF EXIST
        if (report === null) {
          // IF NOT CREATE REPORT
          console.log(3);
          report = await this.create({
            areaId: a,
            procesos: [{ proceso: proceso.flujoId, qty: 1 }],
          });
          console.log(4);

          return;
        }

        // CHECK IF THE PROPERTY PROCESOS EXIST
        if (report?.procesos) {
          let exist = report?.procesos?.filter(
            (p: any) => p.proceso._id == proceso.flujoId,
          )[0];
          console.log(exist, 'exist');

          if (exist) {
            console.log(5);
            let newProcesos = report.procesos.map((p: any) =>
              p.proceso._id == proceso.flujoId ? { ...p, qty: p.qty + 1 } : p,
            );

            console.log(6);
            report.procesos = [...newProcesos];
          } else {
            report.procesos.push({ proceso: proceso.flujoId, qty: 1 });
          }
          console.log(7);
          await report.save();
          console.log(8);
        }
      });
    } catch (error) {
      console.log(error.message, 'handleReportProceso');
      return error;
    }
  }

  async getReportOfTheMonth(): Promise<any> {
    try {
      let report = await this.report
        .find(this.dateQuery)
        .sort({ activitiesEficiencia: -1 })
        .populate('areaId', 'name');

      return report[0];
    } catch (error) {
      console.log(error, 'ppp');
      return error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
