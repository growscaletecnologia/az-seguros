import { PartialType } from '@nestjs/swagger'
import { CreateAvaliationDto } from './create-avaliation.dto'

export class UpdateAvaliationDto extends PartialType(CreateAvaliationDto) {}
