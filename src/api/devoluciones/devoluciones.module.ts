import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Db
import { Devolucion, DevolucionSchema } from '@/schemas/devoluciones.schema';
import { Activity, ActivitySchema } from '@/schemas/activities.schema';

//
import { DevolucionesService } from './devoluciones.service';
import { DevolucionesController } from './devoluciones.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Devolucion.name, schema: DevolucionSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [DevolucionesController],
  providers: [DevolucionesService],
})
export class DevolucionesModule {}
