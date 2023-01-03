import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FlujosService } from './flujos.service';
import { CreateFlujoDto } from './dto/create-flujo.dto';
import { UpdateFlujoDto } from './dto/update-flujo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Flujos')
@Controller('flujos')
export class FlujosController {
  constructor(private readonly flujosService: FlujosService) {}

  @Post()
  create(@Body() createFlujoDto: CreateFlujoDto) {
    return this.flujosService.create(createFlujoDto);
  }

  @Get()
  findAll() {
    return this.flujosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flujosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFlujoDto: UpdateFlujoDto) {
    return this.flujosService.update(id, updateFlujoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flujosService.remove(id);
  }
}
