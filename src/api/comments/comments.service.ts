import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Services
import { ActivitiesService } from '../activities/activities.service';

// Schema
import { CommentDocument, Comment } from '@/schemas/comments.schema';

// DTOS
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private comment: Model<CommentDocument>,
    private activityService: ActivitiesService,
  ) {}

  // Create Comment
  async create(createCommentDto: CreateCommentDto) {
    try {
      let comment = await this.comment.create({
        ...createCommentDto,
      });

      return await this.activityService.updateActivityComments(
        createCommentDto.activityId,
        comment._id,
      );
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  // Find by activity
  async findByActivity(id: string) {
    try {
      const comments = await this.comment
        .find({ activityId: id })
        .populate('userId', 'name')
        .populate('activityId', 'step');
      return comments;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  // Find by document
  async findByDocument(id: string) {
    try {
      const comments = await this.comment
        .find({ documentId: id })
        .populate('userId', 'name')
        .populate('activityId', 'step');
      return comments;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      return await this.comment.findByIdAndUpdate(id, updateCommentDto);
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async remove(id: string) {
    try {
      return await this.comment.findByIdAndDelete(id);
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
}
