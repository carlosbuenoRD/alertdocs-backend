import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) { }

  @Patch(':id/daysPrevRequest')
  async create(@Param() id: string, @Body() days: number) {
    try {
      return await this.configurationService.updateDaysPrevRequest(id, days)
    } catch (error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/documentSetting')
  findDocumentSetting() {
    return this.configurationService.findDocumentSetting();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configurationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationService.update(+id, updateConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configurationService.remove(+id);
  }
}
