import { ApiProperty } from '@nestjs/swagger';
import { IActivities } from '@/interfaces/activities.interface';

export class CreateFlujoDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  activitiesSchema: [IActivities];
}