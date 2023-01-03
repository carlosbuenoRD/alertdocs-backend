import { ApiProperty } from '@nestjs/swagger';
import { IActivities } from '@/interfaces/activities.interface';

export class Flujo {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  activitiesSchema: [IActivities];
}
