import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'

enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

class MetadataDto {
  // @IsString()
  // @IsOptional()
  // title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  keywords?: string
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  id?: string

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
