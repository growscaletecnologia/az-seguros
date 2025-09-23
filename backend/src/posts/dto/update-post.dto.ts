import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'

enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

class MetadataDto {
  @IsString()
  @IsNotEmpty({ message: 'O título para SEO é obrigatório.' })
  @MaxLength(60, {
    message: 'O título para SEO deve ter no máximo 60 caracteres.',
  })
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  keywords: string
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  slug?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  resume?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto

  @IsOptional()
  @IsArray()
  categoryIds?: string[]

  @IsOptional()
  @IsArray()
  tagIds?: string[]

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus

  @IsString()
  @ApiProperty({ example: 'data:image/png;base64,<arquivo base64>' })
  @IsOptional()
  mainImage?: string
}
