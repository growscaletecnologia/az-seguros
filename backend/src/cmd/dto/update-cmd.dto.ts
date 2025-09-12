import { PartialType } from '@nestjs/mapped-types';
import { CreateCmdDto } from './create-cmd.dto';

export class UpdateCmdDto extends PartialType(CreateCmdDto) {}
