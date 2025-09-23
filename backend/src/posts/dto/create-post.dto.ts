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

enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}
export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string

  @IsNotEmpty({ message: 'O slug é obrigatório.' })
  @IsString()
  slug: string

  @IsEnum(PostStatus)
  @IsNotEmpty({ message: 'O status é obrigatório.' })
  status: PostStatus

  @IsOptional()
  @IsString()
  content: string

  @IsNotEmpty({ message: 'O resumo é obrigatório.' })
  @IsString()
  resume: string

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto

  @IsOptional()
  @IsArray()
  categoryIds?: string[]

  @IsOptional()
  @IsArray()
  tagIds?: string[]

  @IsString()
  @ApiProperty({ example: 'data:image/png;base64,<arquivo base64>' })
  @IsOptional()
  mainImage?: string
}
