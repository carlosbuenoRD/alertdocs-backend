import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Model
import { Solicitudes, SolicitudeSchema } from './schema';

// Controller
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Solicitudes.name, schema: SolicitudeSchema }])
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService]
})
export class SolicitudesModule { }
