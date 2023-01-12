import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// SCHEMA
import { Files, FileDocument } from '@/schemas/files.schema';

// Services
import { ActivitiesService } from '../activities/activities.service';

// DTOS
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Files.name) private files: Model<FileDocument>,
    private activities: ActivitiesService,
  ) {}

  async create(createFileDto: CreateFileDto) {
    try {
      const createdFile = await this.files.create(createFileDto);
      await this.activities.updateActivityFiles(
        createFileDto.activityId,
        createdFile._id,
      );
      return createdFile;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByActivity(id: string) {
    try {
      const files = await this.files.find({ activityId: id });
      return files;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async findByDocument(id: string) {
    try {
      const files = await this.files
        .find({ documentId: id })
        .populate('activityId');
      return files;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async remove(id: string) {
    try {
      const deletedFile = await this.files.findByIdAndDelete(id);
      return deletedFile;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
