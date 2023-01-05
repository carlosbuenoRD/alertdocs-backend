import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Schema
import { Document, DocumentsDoc } from '@/schemas/documents.schema';

// Services
import { ActivitiesService } from '../activities/activities.service';

// DTOS
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { IActivitiesDocument } from '@/interfaces/activities.interface';
import { Activity } from '@/schemas/activities.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documents: Model<DocumentsDoc>,
    private activityService: ActivitiesService,
  ) {}

  // CREATE A DOCUMENT
  async create(createDocumentDto: CreateDocumentDto) {
    try {
      const createdDocument = await this.documents.create({
        flujoId: createDocumentDto.flujoId,
        description: createDocumentDto.description,
        libramiento: createDocumentDto.libramiento,
        participants: createDocumentDto.participants,
        transcode: createDocumentDto.transcode,
      });

      // Loop for every activity and creating
      createDocumentDto.activities.forEach(async (i: IActivitiesDocument) => {
        try {
          const activity = await this.activityService.create(
            i,
            createdDocument._id,
          );

          // Adding created activity to the document
          createdDocument.activities.push(activity._id);

          // Saving the document
          await createdDocument.save();
        } catch (error) {
          console.log(error.message);
          return error.message;
        }
      });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  // FIND ALL DOCUMENTS
  async findAll() {
    try {
      const documents = await this.documents.find();
      return documents;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  // FIND BY ID
  async findOne(id: string) {
    try {
      const document = await this.documents.findById(id);
      return document;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  // FIND BY AREA
  async findByArea(id: string) {
    try {
      const documents = await this.documents.find({ areaId: id });
      return documents;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  async remove(id: string) {
    try {
      const document = await this.documents.findByIdAndDelete(id);
      return document;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
