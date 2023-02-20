import { Activity } from '@/schemas/activities.schema';
import { Devolucion } from '@/schemas/devoluciones.schema';
import { ApiProperty } from '@nestjs/swagger';

export class addingTypeReportDto {
  @ApiProperty({ required: false })
  activity: Activity;

  @ApiProperty({ required: false })
  devolucion: Devolucion;
}
