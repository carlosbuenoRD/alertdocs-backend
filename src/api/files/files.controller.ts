import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFileStorage } from '@/utils/multerConfig';

// SERVICES
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveFileStorage))
  create(
    @Query('activity') activity,
    @Query('document') document,
    @Query('user') user,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.create({
      activityId: activity,
      documentId: document,
      userId: user,
      file: file.filename,
    });
  }

  @Get('activity/:id')
  findByActivities(@Param('id') id: string) {
    return this.filesService.findByActivity(id);
  }

  @Get('document/:id')
  findByDocuments(@Param('id') id: string) {
    return this.filesService.findByDocument(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
