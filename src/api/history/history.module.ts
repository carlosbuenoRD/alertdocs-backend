import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from '../activities/activities.module';

// Schema
import { History, HistorySchema } from '@/schemas/history.schema';

// CONTROLLER
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
    ActivitiesModule,
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
