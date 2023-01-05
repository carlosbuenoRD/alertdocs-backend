import { IActivitiesDocument } from '@/interfaces/activities.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  transcode: string;

  @ApiProperty()
  libramiento: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  participants: [string];

  @ApiProperty()
  activities: [IActivitiesDocument];

  @ApiProperty()
  flujoId: string;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty()
  endedAt: Date;
}
