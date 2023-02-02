import { PartialType } from '@nestjs/swagger';
import { CreateDevolucioneDto } from './create-devolucione.dto';

export class UpdateDevolucioneDto extends PartialType(CreateDevolucioneDto) {}
