import { IActivitiesDocument } from '@/interfaces/activities.interface';
import { ClientProps } from '@/schemas/documents.schema';
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
  subprocess: string;

  @ApiProperty()
  activities: IActivitiesDocument[];

  @ApiProperty()
  flujoId: string;

  @ApiProperty()
  areas: [string];

  @ApiProperty()
  direcciones: [string];

  @ApiProperty()
  departments: [string];

  @ApiProperty()
  startedAt: number;

  @ApiProperty()
  endedAt: number;

  @ApiProperty()
  clients: ClientProps[];
}
