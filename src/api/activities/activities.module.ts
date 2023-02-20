import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express/multer';
import { join } from 'path';

// SCHEMA
import { Activity, ActivitySchema } from '@/schemas/activities.schema';

// CONTROLLER
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
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
