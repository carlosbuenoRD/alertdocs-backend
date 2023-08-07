import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

// DB
import { Areas, AreaDocument } from '@/schemas/areas.schema';
import { Direcciones, DireccionDocument } from '@/schemas/direcciones.schema';
import { Departments, DepartmentDocument } from '@/schemas/departments.schema';

// DTOS
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

// const { data } = await this.axios.axiosRef.get(
//   `https://localhost:7197/areas`,
// );

// data.areas.map(async (area) => {
//   await this.departments.create({
//     areaId: '63cf2cc63212c419f6c80c9c',
//     direccionId: '63cf30543586fe279271788d',
//     name: area.nombre,
//   });
// });

@Injectable()
export class AreasService {
  constructor(
    private readonly axios: HttpService,
    @InjectModel(Areas.name) private areas: Model<AreaDocument>,
    @InjectModel(Direcciones.name)
    private direcciones: Model<DireccionDocument>,
    @InjectModel(Departments.name)
    private departments: Model<DepartmentDocument>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    return await this.areas.create(createAreaDto);
  }

  async findAllAreas() {
    try {
      const areas = await this.areas.find();

      return areas;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  async findAllDirecciones(id: string) {
    try {
      console.log(id);

      const direcciones = await this.direcciones.find({ areaId: id });

      return direcciones;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findAllDeparments(id: string) {
    try {
      const departments = await this.departments.find({ direccionId: id });

      return departments;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findOne(id: string) {
    try {
      const area = await this.areas.findById(id);

      return area;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findOneDireccion(id: string) {
    try {
      const direccion = await this.direcciones.findById(id);

      return direccion;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findOneDepartment(id: string) {
    try {
      const department = await this.departments.findById(id);

      return department;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
