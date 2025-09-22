import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator'

export class AssignUserPermissionsDto {
  @ApiProperty({
    description: 'Array of permission IDs to assign to the user',
    example: [1, 2, 3],
    type: [Number],
  })
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
