import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

// DTOS
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(private readonly axios: HttpService) {}

  create(createAreaDto: CreateAreaDto) {
    return 'This action adds a new area';
  }

  async findAll() {
    try {
      const { data } = await this.axios.axiosRef.get(
        'https://localhost:7197/areas',
      );

      return data.areas;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} area`;
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
