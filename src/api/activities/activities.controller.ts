import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Services
import { ActivitiesService } from './activities.service';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Patch('/user/:id')
  update(@Param('id') id: string, @Body() body: UpdateActivityDto) {
    return this.activitiesService.update(id, body);
  }

  @Patch()
  updateActivities(@Body() body: any) {
    return this.activitiesService.updateActivities(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Get('count/:id')
  getUserActivitiesCount(@Param('id') id: string) {
    return this.activitiesService.getUserActivitiesCount(id);
  }

  @Get('myactivity/:id')
  findMyActivities(@Param('id') id: string) {
    return this.activitiesService.findMyActitvities(id);
  }

  @Get('flujo/:id')
  findByFlujo(@Param('id') id: string) {
    return this.activitiesService.findByFlujo(id);
  }

  @Get('area/:id')
  findByArea(@Param('id') id: string) {
    return this.activitiesService.findByArea(id);
  }

  @Get('direccion/:id')
  findByDireccion(@Param('id') id: string) {
    return this.activitiesService.findByDireccion(id);
  }

  @Get('department/:id')
  findByDepartment(@Param('id') id: string) {
    return this.activitiesService.findByDepartment(id);
  }

  @Get('document/:id')
  findByDocument(@Param('id') id: string) {
    return this.activitiesService.findByDocument(id);
  }

  @Get('/completed/document/:id')
  findCompletedByDocument(@Param('id') id: string) {
    return this.activitiesService.findCompletedByDocument(id);
  }

  @Get('/completed/area/:id')
  findCompletedByArea(@Param('id') id: string) {
    return this.activitiesService.findCompletedByArea(id);
  }

  @Get(':area/:document')
  findByDocumentAndArea(
    @Param('area') area: string,
    @Param('document') document: string,
  ) {
    return this.activitiesService.findByDocumentAndArea(area, document);
  }

  @Get('/flujo/:flujo/:user')
  findByUserAndFlujo(
    @Param('flujo') flujo: string,
    @Param('user') user: string,
  ) {
    return this.activitiesService.findByUserAndFlujo(flujo, user);
  }

  @Get('/area/:flujo/:area')
  findByAreaAndFlujo(
    @Param('flujo') flujo: string,
    @Param('area') area: string,
  ) {
    return this.activitiesService.findByAreaAndFlujo(flujo, area);
  }

  @Patch('changestate/:id')
  async changeActivityState(@Param('id') id: string, @Body() info: any) {
    try {
      return await this.activitiesService.changeActivityState(id, info.state);
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, 500);
    }
  }

  // @Post('upload/:id')
  // @UseInterceptors(FileInterceptor('file', saveFileStorage))
  // uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('id') id: string,
  //   @Request() req,
  // ) {

  //   this.activitiesService.updateActivityFiles(id, file.filename);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
  //   return this.activitiesService.update(+id, updateActivityDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.activitiesService.remove(+id);
  // }
}
