import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Schema
import { Report, ReportDocument } from '@/schemas/reports.schema';

// DTOS
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { addingTypeReportDto } from './dto/adding-type.dto';
import { getEficiencia } from '@/utils/formula';

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
      let report = await this.report.findById(id).populate('areaId', 'name');
      return report;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByArea(id: string) {
    try {
      let report = await this.report
        .findOne({
          areaId: id,
          ...this.dateQuery,
        })
        .populate('areaId', 'name');
      return report;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async update(id: string, item: any, type: string) {
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
