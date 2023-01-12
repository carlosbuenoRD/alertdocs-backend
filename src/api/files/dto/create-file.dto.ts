import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  file: string;
  @ApiProperty()
  activityId: string;
  @ApiProperty()
  documentId: string;
}
