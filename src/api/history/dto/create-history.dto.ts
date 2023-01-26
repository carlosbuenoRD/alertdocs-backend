import { ApiProperty } from '@nestjs/swagger';

export class CreateHistoryDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  action: string;
  @ApiProperty()
  activityId: string;
  @ApiProperty()
  documentId: string;
  @ApiProperty()
  step: number;
}
