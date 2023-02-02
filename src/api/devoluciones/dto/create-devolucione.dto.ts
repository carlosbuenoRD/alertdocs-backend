import { ApiProperty } from '@nestjs/swagger';

export class CreateDevolucioneDto {
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
