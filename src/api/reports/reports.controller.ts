import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { addingTypeReportDto } from './dto/adding-type.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll() {
    try {
      return this.reportsService.findAll();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.reportsService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('area/:id')
  async findByArea(@Param('id') id: string) {
    try {
      return this.reportsService.findByArea(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('month/top1')
  async getReportOfTheMonth() {
    try {
      return this.reportsService.getReportOfTheMonth();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('month/mepyd')
  async getMepydDetails() {
    try {
      return this.reportsService.getMepydDetails();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Patch(':id/:type')
  update(
    @Param('id') id: string,
    @Param('type') type: string,
    @Body() updateReportDto: addingTypeReportDto,
  ) {
    try {
      return this.reportsService.update(id, updateReportDto, type);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
