import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

class MetadataDto {
  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  keywords?: string
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

  @IsOptional()
  @IsString()
  slug?: string

  @IsEnum(PostStatus)
  @IsNotEmpty({ message: 'O status é obrigatório.' })
  status: PostStatus

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

  @IsString()
  @ApiProperty({ example: 'data:image/png;base64,<arquivo base64>' })
  @IsOptional()
  mainImage?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'URL completa do post',
    example: '/blog/seguros/passaporte',
  })
  fullUrl?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'URL da imagem de capa do post',
    example: 'https://example.com/image.jpg',
  })
  coverImage?: string
}
