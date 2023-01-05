import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// SCHEMA
import { Activity, ActivitySchema } from '@/schemas/activities.schema';

// CONTROLLER
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
