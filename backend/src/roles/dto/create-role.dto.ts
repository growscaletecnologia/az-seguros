import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'EDITOR',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Optional description of the role',
    example: 'Can edit content but not delete',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Whether this is a system role that cannot be modified by users',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean
}
