import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// SERVICES
import { HistoryService } from './history.service';

// DTOS
import { CreateHistoryDto } from './dto/create-history.dto';

@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  @Get('document/:id')
  findByDocument(@Param('id') id: string) {
    return this.historyService.findByDocument(id);
  }

  @Get('activity/:id')
  findByActivity(@Param('id') id: string) {
    return this.historyService.findByActivity(id);
  }
}
