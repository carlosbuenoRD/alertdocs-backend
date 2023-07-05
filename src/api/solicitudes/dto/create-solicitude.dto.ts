import { ApiProperty } from "@nestjs/swagger";

export class CreateSolicitudeDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  entity: string;

  @ApiProperty()
  entityId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  justification: string;

  @ApiProperty()
  state: string;
}
