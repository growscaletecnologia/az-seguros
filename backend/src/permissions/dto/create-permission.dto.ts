import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Action } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePermissionDto {
  @ApiProperty({
    description: 'The resource name that the permission applies to',
    example: 'users',
  })
  @IsNotEmpty()
  @IsString()
  resource: string

  @ApiProperty({
    description: 'The action that can be performed on the resource',
    enum: Action,
    example: 'READ',
  })
  @IsNotEmpty()
  @IsEnum(Action)
  action: Action

  @ApiProperty({
    description: 'Optional description of the permission',
    example: 'Allows reading user data',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string
}
