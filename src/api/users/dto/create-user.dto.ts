import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  active: boolean;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  area: string;

  @ApiProperty()
  direccion: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  cargo: string;

  @ApiProperty()
  isAdmin: string;
}
