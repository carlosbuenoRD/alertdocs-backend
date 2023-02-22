import { ApiProperty } from '@nestjs/swagger';

// Schemas
import { Activity } from '@/schemas/activities.schema';
import { Devolucion } from '@/schemas/devoluciones.schema';
import { User } from '@/schemas/users.schema';

export class CreateReportDto {
  @ApiProperty({ required: false })
  activities?: any[];

  @ApiProperty({ required: false })
  procesos?: any[];

  @ApiProperty({ required: false })
  activitiesTime?: number;

  @ApiProperty({ required: false })
  activitiesEficiencia?: number;

  @ApiProperty({ required: false })
  devoluciones?: any[];

  @ApiProperty({ required: false })
  devolucionesTime?: number;

  @ApiProperty({ required: false })
  user?: User;

  @ApiProperty({ required: false })
  areaId?: string;

  @ApiProperty({ required: false })
  direccionId?: string;

  @ApiProperty({ required: false })
  departmentId?: string;
}
