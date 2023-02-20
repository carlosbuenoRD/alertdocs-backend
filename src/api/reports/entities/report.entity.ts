import { ApiProperty } from '@nestjs/swagger';

export class Report {
  @ApiProperty()
  activities: string[];

  @ApiProperty()
  activitiesTime: number;

  @ApiProperty()
  devoluciones: string[];

  @ApiProperty()
  devolucionesTime: number;

  @ApiProperty()
  user: string;

  @ApiProperty()
  areaId: string;

  @ApiProperty()
  direccionId: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  createdAt: string;
}
