import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from '../activities/activities.module';

// Schema
import { Document, DocumentsSchema } from '@/schemas/documents.schema';
import { Activity, ActivitySchema } from '@/schemas/activities.schema';

// CONTROLLER
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentsSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    ActivitiesModule,
    ReportsModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
