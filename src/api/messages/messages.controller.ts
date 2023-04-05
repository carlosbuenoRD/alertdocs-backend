import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Request() req) {
    return this.messagesService.createMessage(req);
  }

  @Get('/:id')
  findAll(@Request() req) {
    return this.messagesService.getMessages(req);
  }
}
