import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  text: string;
  @ApiProperty()
  activityId: string;
  @ApiProperty()
  documentId: string;
}
