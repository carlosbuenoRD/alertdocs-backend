import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express/multer';
import { join } from 'path';

// SCHEMA
import { Activity, ActivitySchema } from '@/schemas/activities.schema';
import { Document, DocumentsSchema } from '@/schemas/documents.schema';

// CONTROLLER
import { ReportsModule } from '../reports/reports.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: Document.name, schema: DocumentsSchema },
    ]),
    MulterModule.register({
      dest: join(__dirname, '../../..', 'public/uploads'),
    }),
    ReportsModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
