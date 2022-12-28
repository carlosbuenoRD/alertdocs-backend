import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  area: string;

  @ApiProperty()
  cargo: string;

  @ApiProperty()
  isAdmin: string;
}
