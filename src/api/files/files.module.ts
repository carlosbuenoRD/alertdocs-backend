import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from '../activities/activities.module';

// Schema
import { Files, FilesSchema } from '@/schemas/files.schema';
import { Activity, ActivitySchema } from '@/schemas/activities.schema';

// CONTROLLER
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Files.name, schema: FilesSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    ActivitiesModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
