import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from './../activities/activities.module';

// Schema
import { Comment, CommentSchema } from '@/schemas/comments.schema';

// SERVICES
import { CommentsService } from './comments.service';

// CONTROLLER
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    ActivitiesModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
