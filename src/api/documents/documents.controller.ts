import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    try {
      return await this.documentsService.create(createDocumentDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.documentsService.findAll();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.documentsService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('area/:id')
  async findByArea(@Param('id') id: string) {
    try {
      return await this.documentsService.findByArea(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('direccion/:id')
  async findByDireccion(@Param('id') id: string) {
    try {
      return await this.documentsService.findByDireccion(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('/department/:id')
  async findByDepartment(@Param('id') id: string) {
    try {
      return await this.documentsService.findByDepartment(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('completed/area/:id')
  async findCompletedByArea(@Param('id') id: string) {
    try {
      return await this.documentsService.findCompletedByArea(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('completed/direccion/:id')
  async findCompletedByDireccion(@Param('id') id: string) {
    try {
      return await this.documentsService.findCompletedByDireccion(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get('completed//department/:id')
  async findCompletedByDepartment(@Param('id') id: string) {
    try {
      return await this.documentsService.findCompletedByDepartment(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDocumentDto: UpdateDocumentDto,
  // ) {
  //   return this.documentsService.update(+id, updateDocumentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
