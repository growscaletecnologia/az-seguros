import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Array of permission IDs to assign to the role',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[]

  @ApiProperty({
    description: 'Whether to allow or deny the permissions',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  allow?: boolean = true
}
