import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Service
import { AreasService } from './areas.service';

// DTO
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@ApiTags('Areas')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  findAllAreas() {
    return this.areasService.findAllAreas();
  }

  @Get('direcciones/:id')
  findAllDirecciones(@Param('id') id: string) {
    return this.areasService.findAllDirecciones(id);
  }

  @Get('departments/:id')
  findAllDeparments(@Param('id') id: string) {
    return this.areasService.findAllDeparments(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(id);
  }

  @Get('direccion/:id')
  findOneDireccion(@Param('id') id: string) {
    return this.areasService.findOneDireccion(id);
  }

  @Get('department/:id')
  findOneDepartment(@Param('id') id: string) {
    return this.areasService.findOneDepartment(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}
