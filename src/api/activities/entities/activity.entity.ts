import { ApiProperty } from '@nestjs/swagger';

export class IActivity {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  areaId: string;

  @ApiProperty()
  direccionId: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  hours: number;

  @ApiProperty()
  step: number;

  @ApiProperty()
  usersId: string;

  @ApiProperty()
  startedAt: number;

  @ApiProperty()
  endedAt: number;

  @ApiProperty()
  pauseByDevolucion: number;

  @ApiProperty()
  continueByDevolucion: number;

  @ApiProperty({ default: 0 })
  devolucionTime: number;

  @ApiProperty()
  documentId: string;

  @ApiProperty()
  flujoId: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  comments: string[];

  @ApiProperty()
  files: string[];
}
