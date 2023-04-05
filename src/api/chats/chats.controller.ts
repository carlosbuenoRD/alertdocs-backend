import {
  Body,
  Patch,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt.guard';

// DTOS
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Request() req) {
    return this.chatsService.accessChat(req);
  }

  @Post('/group')
  createGroup(@Request() req) {
    return this.chatsService.createGroupChat(req);
  }

  @Get()
  findAll(@Request() req) {
    return this.chatsService.getAllChats(req);
  }

  @Patch('/group/rename:id')
  renameGroup(@Request() req) {
    return this.chatsService.renameGroupChat(req);
  }

  @Patch('/group/add/:id')
  addToGroup(@Request() req) {
    return this.chatsService.addToGroup(req);
  }

  @Patch('/group/remove/:id')
  removeFromGroup(@Request() req) {
    return this.chatsService.removeFromGroup(req);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatsService.remove(+id);
  // }
}
