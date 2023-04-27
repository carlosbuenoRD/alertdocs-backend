import { ApiProperty } from '@nestjs/swagger';

export class CreateDevolucioneDto {
  @ApiProperty()
  flujo: string;

  @ApiProperty()
  document: string;

  @ApiProperty()
  activityFrom: string;

  @ApiProperty()
  activityTo: string;

  @ApiProperty()
  userFrom: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  missing: [string];
}
