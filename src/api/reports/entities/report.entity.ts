import { ApiProperty } from '@nestjs/swagger';

export class Report {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  activities: string[];

  @ApiProperty()
  goodActivities: string[];

  @ApiProperty()
  badActivities: string[];

  @ApiProperty()
  mediumActivities: string[];

  @ApiProperty({ default: 0 })
  activitiesEficiencia: number;

  @ApiProperty({ default: 0 })
  activitiesTime: number;

  @ApiProperty()
  devoluciones: string[];

  @ApiProperty({ default: 0 })
  devolucionesTime: number;

  @ApiProperty()
  user: string;

  @ApiProperty()
  areaId: string;

  @ApiProperty()
  direccionId: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty({ default: new Date().getMonth() })
  month: number;

  @ApiProperty({ default: new Date().getFullYear() })
  year: number;
}
