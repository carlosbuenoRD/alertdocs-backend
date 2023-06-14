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
import { ReportsService } from '../reports/reports.service';
import { User, UserDocument } from '@/schemas/users.schema';
import { QuerieDocument } from './dto/queries-document.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documents: Model<DocumentsDoc>,
    @InjectModel(User.name) private users: Model<UserDocument>,
    private activityService: ActivitiesService,
    private reportService: ReportsService,
    private userService: UsersService,
  ) { }

  // CREATE A DOCUMENT
  async create(createDocumentDto: CreateDocumentDto, user?: any) {

    try {
      let User
      if (user) {
        User = await this.userService.findById(user)
      }

      console.log('USER', User)

      const createdDocument = await this.documents.create({
        flujoId: createDocumentDto.flujoId,
        description: createDocumentDto.description,
        libramiento: createDocumentDto.libramiento,
        participants: createDocumentDto.participants,
        transcode: createDocumentDto.transcode,
        areas: createDocumentDto.areas.filter(i => i !== 'Solicitante'),
        direcciones: createDocumentDto.direcciones,
        departments: createDocumentDto.departments,
        subprocess: createDocumentDto.subprocess,
        clients: createDocumentDto.clients,
      });

      // Saving document in its report
      await this.reportService.handleReportProceso(createDocumentDto);

      // Loop for every activity and creating

      let activitiesDb = createDocumentDto.activities.map(i => (
        i.areaId !== 'Solicitante' ? {
          ...i,
          usersId: i.usersId[0],
          documentId: createdDocument._id,
          flujoId: createDocumentDto.flujoId
        } : {
          ...i,
          direccionId: User.direccion,
          areaId: User.area,
          usersId: User._id,
          documentId: createdDocument._id,
          flujoId: createDocumentDto.flujoId
        }
      ))

      console.log('ACTIVITIESDBB: ', activitiesDb)

      const activities = await this.activityService.create(
        activitiesDb
      );

      console.log('ALL ACTIVITIES', activities)
      createdDocument.activities = activities.map(i => i._id)

      await createdDocument.save()
      console.log(createdDocument.activities)
      // Saving activities in the document
      return createdDocument
    } catch (error) {
      console.log(error.message, 'DOCUMENT: create');
      return error.message;
    }
  }

  // UPDATE DOCUMENT
  async update(id: string, body: UpdateDocumentDto) {
    try {
      const document = await this.documents.findByIdAndUpdate(id, body);
      return document;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: find all');
      return error.message;
    }
  }

  // FIND ALL DOCUMENTS
  async findAll(queries?: QuerieDocument) {
    const { area, type } = queries
    console.log('QUERIES', queries)
    let query: any = {}

    if (area) query.areas = { $in: area.split(',') }

    try {
      let documents = await this.documents.find({ ...query, endedAt: { $exists: false } }).populate('areas').populate('flujoId');
      if (type) {
        documents = documents.filter((i) => i.flujoId.type?.includes(type))
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
        .populate('activities')

      let completedDocument = await this.users.populate(document, 'activities.usersId')
      console.log('Completed Document', completedDocument)
      return document;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: find one');
      return error.message;
    }
  }

  // FIND ALL IN PROCESS
  async findInProcess() {
    try {
      const documents = await this.documents
        .find({ endedAt: { $exists: false } })

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
      console.log(activities)
      let updatedDocument = await this.documents.findByIdAndUpdate(id, { activities });
      return updatedDocument
    } catch (error) {
      console.log(error.message, 'DOCUMENT: udpdate activities');
      return error.message;
    }
  }

  async remove(id: string) {
    try {
      const document = await this.documents.findByIdAndDelete(id);
      return document;
    } catch (error) {
      console.log(error.message, 'DOCUMENT: remove');
      return error.message;
    }
  }
}


let ok = {
  "type": "Pago",
  "description": "Pagos de viaticos",
  "descriptions": ["Nacionales", "Internacionales"],
  "areas": [{ "$oid": "63cf2cc63212c419f6c80c9c" }],
  "participants": [
    { "$oid": "63cfd48a7fa2e7a5ae2d4af8" },
    { "$oid": "63cfd48a7fa2e7a5ae2d4a9a" },
    { "$oid": "63cfd48a7fa2e7a5ae2d4a98" },
    { "$oid": "63cfd48a7fa2e7a5ae2d4b28" },
    { "$oid": "63cfd48a7fa2e7a5ae2d4b10" },
    { "$oid": "63cfd48a7fa2e7a5ae2d4bf0" },
    { "$oid": "63cfd48a7fa2e7a5ae2d4b64" }
  ],
  "activitiesSchema": [
    { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Recibe y valida que la solicitud se haya realizado correctamente", "hours": { "$numberDouble": "0.08333333333333333" }, "step": { "$numberInt": "1" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4af8" }], "_id": { "$oid": "647d06735826d323266bf848" } }
    , { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Valida y confirma en el Intranet el registro del viatico", "hours": { "$numberDouble": "0.08333333333333333" }, "step": { "$numberInt": "2" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4af8" }], "_id": { "$oid": "647d06735826d323266bf849" } },
    { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Valida y aprueba que el expediente se encuentre correcto", "hours": { "$numberDouble": "0.16666666666666666" }, "step": { "$numberInt": "3" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4a9a" }], "_id": { "$oid": "647d06735826d323266bf84a" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Recibe, valida e imprime el registro del viatico", "hours": { "$numberDouble": "0.11666666666666667" }, "step": { "$numberInt": "4" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4af8" }], "_id": { "$oid": "647d06735826d323266bf84b" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Realiza la solicitud de pago", "hours": { "$numberDouble": "0.16666666666666666" }, "step": { "$numberInt": "5" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4af8" }], "_id": { "$oid": "647d06735826d323266bf84c" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Valida y aprueba que la solicitud de pago se encuentre correcta", "hours": { "$numberDouble": "0.16666666666666666" }, "step": { "$numberInt": "6" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4a9a" }], "_id": { "$oid": "647d06735826d323266bf84d" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Registra en el libro de Record la solicitud de pago y remite", "hours": { "$numberDouble": "0.11666666666666667" }, "step": { "$numberInt": "7" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4af8" }], "_id": { "$oid": "647d06735826d323266bf84e" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Revisa, registra en el Record y canaliza para firma del director", "hours": { "$numberDouble": "0.13333333333333333" }, "step": { "$numberInt": "8" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4a98" }], "_id": { "$oid": "647d06735826d323266bf84f" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Recibe, revisa, firma y autoriza la solicitud de pago", "hours": { "$numberInt": "1" }, "step": { "$numberInt": "9" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4b28" }], "_id": { "$oid": "647d06735826d323266bf850" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Recibe, revisa y remite la solicitud", "hours": { "$numberDouble": "0.08333333333333333" }, "step": { "$numberInt": "10" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4a98" }], "_id": { "$oid": "647d06735826d323266bf851" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Recibe, valida, revisa y remite la solicitud", "hours": { "$numberDouble": "0.16666666666666666" }, "step": { "$numberInt": "11" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4b10" }], "_id": { "$oid": "647d06735826d323266bf852" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Recibe, revisa, valida que este correcta la solicitud y remite", "hours": { "$numberDouble": "0.16666666666666666" }, "step": { "$numberInt": "12" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4bf0" }], "_id": { "$oid": "647d06735826d323266bf853" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Revisa, firma y autoriza la solicitud", "hours": { "$numberInt": "3" }, "step": { "$numberInt": "13" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4b64" }], "_id": { "$oid": "647d06735826d323266bf854" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Recibe, registra, escanea y da salida al expediente ", "hours": { "$numberDouble": "0.16666666666666666" }, "step": { "$numberInt": "14" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4bf0" }], "_id": { "$oid": "647d06735826d323266bf855" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Recibe, valida y clasifica el viatico según su categoria", "hours": { "$numberDouble": "0.16666666666666666" }, "step": { "$numberInt": "15" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4af8" }], "_id": { "$oid": "647d06735826d323266bf856" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Realiza un recibo y guarda al solicitate", "hours": { "$numberDouble": "0.16666666666666666" }, "step": { "$numberInt": "16" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4af8" }], "_id": { "$oid": "647d06735826d323266bf857" } }, { "areaId": "63cf2cc63212c419f6c80c9c", "direccionId": "63cf30543586fe279271788c", "departmentId": "", "description": "Entrega el dinero y guarda el recibo", "hours": { "$numberDouble": "0.08333333333333333" }, "step": { "$numberInt": "17" }, "usersId": [{ "$oid": "63cfd48a7fa2e7a5ae2d4af8" }], "_id": { "$oid": "647d06735826d323266bf858" } }], "__v": { "$numberInt": "0" }
}