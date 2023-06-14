import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

//
import { DevolucionesService } from './devoluciones.service';

// DTO
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
// import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';

@ApiTags('Devoluciones')
@Controller('devoluciones')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) { }

  @Post()
  async create(@Body() createDevolucioneDto: CreateDevolucioneDto) {
    try {
      return this.devolucionesService.create(createDevolucioneDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll() {
    return this.devolucionesService.findAll();
  }

  @Get('/activity/:id')
  findByActivity(@Param('id') id: string) {
    return this.devolucionesService.findByActivity(id);
  }

  @Get('/count/:id')
  getUserDevolucionesCount(@Param('id') id: string) {
    return this.devolucionesService.getUserDevolucionesCount(id);
  }

  @Get('/user/:id')
  findByUser(@Param('id') id: string) {
    return this.devolucionesService.findByUser(id);
  }

  @Get('/area/:id')
  findByArea(@Param('id') id: string) {
    return this.devolucionesService.findByArea(id);
  }

  @Get('/direccion/:id')
  findByDireccion(@Param('id') id: string) {
    return this.devolucionesService.findByDireccion(id);
  }

  @Get('/department/:id')
  findByDepartment(@Param('id') id: string) {
    return this.devolucionesService.findByDepartment(id);
  }

  @Get('/all/in-process')
  findInProcess() {
    return this.devolucionesService.findInProcess();
  }

  @Get('/flujo/:id')
  findByFlujo(@Param('id') id: string) {
    return this.devolucionesService.findByFlujo(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devolucionesService.findOne(id);
  }

  @Patch('end/:id')
  async endDevolucion(@Param('id') id: string) {
    try {
      return this.devolucionesService.endDevolucion(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevolucioneDto: any) {
    return this.devolucionesService.update(+id, updateDevolucioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devolucionesService.remove(+id);
  }
}
