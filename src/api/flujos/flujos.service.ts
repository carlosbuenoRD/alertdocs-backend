import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// Model
import { Flujo, FlujoDocument } from '@/schemas/flujos.schema';

// DTO
import { CreateFlujoDto } from './dto/create-flujo.dto';
import { UpdateFlujoDto } from './dto/update-flujo.dto';
import { Model } from 'mongoose';

@Injectable()
export class FlujosService {
  constructor(@InjectModel(Flujo.name) private flujos: Model<FlujoDocument>) {}

  async create(createFlujoDto: CreateFlujoDto) {
    console.log(createFlujoDto);
    try {
      const createdFlujo = await this.flujos.create(createFlujoDto);
      return createdFlujo;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findAll() {
    try {
      const flujos = await this.flujos.find();
      return flujos;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findOne(id: string) {
    try {
      const flujo = await this.flujos
        .findById(id)
        .populate('activitiesSchema.usersId')
        .populate('participants');
      return flujo;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async update(id: string, updateFlujoDto: UpdateFlujoDto) {
    try {
      const flujo = await this.flujos.findById(id);

      // CHanging values
      flujo.description = updateFlujoDto.description;
      flujo.activitiesSchema = updateFlujoDto.activitiesSchema;

      // Saving changes
      await flujo.save();

      return flujo;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async remove(id: string) {
    try {
      const deletedFlujo = await this.flujos.findByIdAndDelete(id);
      return deletedFlujo;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
