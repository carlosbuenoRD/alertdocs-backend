import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

// CONTROLLER
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';

@Module({
  imports: [HttpModule],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
