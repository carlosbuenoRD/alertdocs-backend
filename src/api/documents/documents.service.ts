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

      let createdActivities = [];

      // Loop for every activity and creating
      createDocumentDto.activities.forEach(async (i: IActivitiesDocument) => {
        try {
          const activity = await this.activityService.create(
            i,
            createdDocument._id,
          );
          console.log(activity);
          // Adding created activity to array
          createdActivities.push(activity._id);
        } catch (error) {
          console.log(error.message);
          return error.message;
        }
      });

      // Saving activities in the document
      console.log(createdActivities);
      await this.updateActivities(createdDocument._id, createdActivities);
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
      const document = await this.documents
        .findById(id)
        .populate('participants');
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

  async updateActivities(id: any, activities: any) {
    try {
      const document = await this.documents.findById(id);

      document.activities.push(activities);
      await document.save();
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
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
