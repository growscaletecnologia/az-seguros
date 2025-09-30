import { PartialType } from '@nestjs/swagger'
import { CreateFrontsectionDto } from './create-frontsection.dto'

export class UpdateFrontsectionDto extends PartialType(CreateFrontsectionDto) {}
