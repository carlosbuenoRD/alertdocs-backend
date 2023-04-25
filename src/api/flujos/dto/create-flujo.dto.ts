import { ApiProperty } from '@nestjs/swagger';
import { IActivities } from '@/interfaces/activities.interface';

export class CreateFlujoDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  descriptions: string[];

  @ApiProperty()
  areas: [string];

  @ApiProperty()
  participants: [string];

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  activitiesSchema: [IActivities];
}
