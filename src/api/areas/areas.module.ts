import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

// db
import { Areas, AreaSchema } from '@/schemas/areas.schema';
import { Direcciones, DireccionSchema } from '@/schemas/direcciones.schema';
import { Departments, DepartmentSchema } from '@/schemas/departments.schema';

// CONTROLLER
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Areas.name, schema: AreaSchema },
      { name: Direcciones.name, schema: DireccionSchema },
      { name: Departments.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
