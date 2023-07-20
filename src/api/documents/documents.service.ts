import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Schema
import { Document, DocumentsDoc } from '@/schemas/documents.schema';

// Services
import { ActivitiesService } from '../activities/activities.service';

// DTOS
import { User, UserDocument } from '@/schemas/users.schema';
import { ReportsService } from '../reports/reports.service';
import { SolicitudesService } from '../solicitudes/solicitudes.service';
import { UsersService } from '../users/users.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QuerieDocument } from './dto/queries-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documents: Model<DocumentsDoc>,
    @InjectModel(User.name) private users: Model<UserDocument>,
    private activityService: ActivitiesService,
    private solicitudesService: SolicitudesService,
    private reportService: ReportsService,
    private userService: UsersService,
  ) {}

  // CREATE A DOCUMENT
  async create(createDocumentDto: CreateDocumentDto, user?: any) {
    try {
      let User;
      if (user) {
        User = await this.userService.findById(user);
      }

      const createdDocument = await this.documents.create({
        flujoId: createDocumentDto.flujoId,
        description: createDocumentDto.description,
        libramiento: createDocumentDto.libramiento,
        participants: createDocumentDto.participants,
        transcode: createDocumentDto.transcode,
        areas: createDocumentDto.areas.filter((i) => i !== 'Solicitante'),
        direcciones: createDocumentDto.direcciones,
        departments: createDocumentDto.departments,
        subprocess: createDocumentDto.subprocess,
        clients: createDocumentDto.clients,
      });

      // Saving document in its report
      await this.reportService.handleReportProceso(createDocumentDto);

      // Loop for every activity and creating

      let activitiesDb = await Promise.all(
        createDocumentDto.activities.map(async (i) => {
          if (i.areaId !== 'Solicitante') {
            return {
              ...i,
              documentId: createdDocument._id,
              flujoId: createDocumentDto.flujoId,
              usersId:
                i.usersId.length > 1
                  ? await this.activityService.selectUserByWorkLoad(i.usersId)
                  : i.usersId[0]._id,
            };
          } else {
            let inParticipants = createdDocument.participants.find(
              (i) => i === User._id,
            );
            if (!inParticipants) createdDocument.participants.push(User._id);
            return {
              ...i,
              direccionId: User.direccion,
              areaId: User.area,
              usersId: User._id,
              documentId: createdDocument._id,
              flujoId: createDocumentDto.flujoId,
            };
          }
        }),
      );
      console.log('DB ACTIVITIES', activitiesDb);
      await createdDocument.save();

      const activities = await this.activityService.create(activitiesDb);

      createdDocument.activities = activities.map((i) => i._id);

      await createdDocument.save();
      // Saving activities in the document
      return createdDocument;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: create');
      return error.message;
    }
  }

  // UPDATE DOCUMENT
  async update(id: string, body: UpdateDocumentDto) {
    console.log(body);
    try {
      const document = await this.documents.findByIdAndUpdate(id, {
        ...body,
        activities: body?.activities?.map((i: any) => i._id),
      });

      await this.activityService.updateActivitiesByDocument(body.activities);

      return await this.findOne(document._id.toString());
    } catch (error) {
      console.log(error.message, 'DOCUMENT: find all');
      return error.message;
    }
  }

  // FIND ALL DOCUMENTS
  async findAll(queries?: QuerieDocument) {
    const { area, type } = queries;
    console.log('QUERIES', queries);
    let query: any = {};

    if (area) query.areas = { $in: area.split(',') };

    try {
      let documents = await this.documents
        .find({ ...query, endedAt: { $exists: false } })
        .populate('areas')
        .populate('flujoId');
      if (type) {
        documents = documents.filter((i) => i.flujoId.type?.includes(type));
      }
      return documents;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: find all');
      return error.message;
    }
  }

  // FIND BY ID
  async findOne(id: string) {
    try {
      let document = await this.documents
        .findById(id)
        .populate('participants')
        .populate('activities');

      let completedDocument = await this.users.populate(
        document,
        'activities.usersId',
      );
      console.log('Completed Document', completedDocument);
      return document;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: find one');
      return error.message;
    }
  }

  // FIND ALL IN PROCESS
  async findInProcess() {
    try {
      const documents = await this.documents.find({
        endedAt: { $exists: false },
      });

      return documents;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: by area');
      return error.message;
    }
  }

  // FIND BY AREA
  async findByArea(id: string) {
    try {
      const documents = await this.documents
        .find({ areas: { $in: id }, endedAt: { $exists: false } })
        .populate('participants');

      return documents;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: by area');
      return error.message;
    }
  }

  // FIND BY Direccion
  async findByDireccion(id: string) {
    try {
      const documents = await this.documents.find({
        direcciones: { $in: id },
        endedAt: { $exists: false },
      });

      return documents;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: by direccion');
      return error.message;
    }
  }

  // FIND BY Department
  async findByDepartment(id: string) {
    try {
      const documents = await this.documents.find({
        departments: { $in: id },
        endedAt: { $exists: false },
      });

      return documents;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: by department');
      return error.message;
    }
  }

  // FIND COMPLETED BY AREA
  async findCompletedByArea(id: string) {
    try {
      // endedAt: { $exists: true }
      const documents = await this.documents
        .find({ areas: { $in: id } })
        .populate('participants');

      return documents;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: by area');
      return error.message;
    }
  }

  // FIND COMPLETED BY Direccion
  async findCompletedByDireccion(id: string) {
    try {
      const documents = await this.documents.find({
        direcciones: { $in: id },
      });

      return documents;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: by direccion');
      return error.message;
    }
  }

  // FIND COMPLETED BY Department
  async findCompletedByDepartment(id: string) {
    try {
      const documents = await this.documents.find({
        departments: { $in: id },
      });

      return documents;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: by department');
      return error.message;
    }
  }

  async updateActivities(id: any, activities: any) {
    try {
      console.log('add document activities', activities);
      let updatedDocument = await this.documents.findByIdAndUpdate(id, {
        activities,
      });
      return updatedDocument;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: udpdate activities');
      return error.message;
    }
  }

  async remove(id: string) {
    try {
      const document = await this.documents.findByIdAndDelete(id);
      await this.activityService.deleteActivitiesByDocument(id);
      await this.solicitudesService.deleteByEntity(id);
      return document;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: remove');
      return error.message;
    }
  }
}
