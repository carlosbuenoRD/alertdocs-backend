import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QuerieDocument } from './dto/queries-document.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto, @Req() request) {
    try {
      return await this.documentsService.create(createDocumentDto, request.user._id);
    } catch (error) {
      return new HttpException(error.message, 500);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() queries: QuerieDocument, @Req() request) {
    try {
      return await this.documentsService.findAll(queries);
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

  @Get('/all/in-process')
  async findInProcess() {
    try {
      return await this.documentsService.findInProcess();
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

  @Get('completed/department/:id')
  async findCompletedByDepartment(@Param('id') id: string) {
    try {
      return await this.documentsService.findCompletedByDepartment(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
