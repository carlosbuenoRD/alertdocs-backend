import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // @Post()
  // create(@Body() createActivityDto: CreateActivityDto) {
  //   return this.activitiesService.create(createActivityDto);
  // }

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Get('myactivity/:id')
  findMyActivities(@Param('id') id: string) {
    return this.activitiesService.findMyActitvities(id);
  }

  @Get('area/:id')
  findByArea(@Param('id') id: string) {
    return this.activitiesService.findByArea(id);
  }

  @Get('document/:id')
  findByDocument(@Param('id') id: string) {
    return this.activitiesService.findByDocument(id);
  }

  @Get(':area/:document')
  findByDocumentAndArea(
    @Param('area') area: string,
    @Param('document') document: string,
  ) {
    return this.activitiesService.findByDocumentAndArea(area, document);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
  //   return this.activitiesService.update(+id, updateActivityDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.activitiesService.remove(+id);
  // }
}
