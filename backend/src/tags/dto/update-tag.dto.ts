import { PartialType } from '@nestjs/swagger'
import { CreateTagDto } from './create-tag.dto'
import { IsString } from 'class-validator'

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsString()
  name: string

  @IsString()
  slug: string

  @IsString()
  description: string
}
