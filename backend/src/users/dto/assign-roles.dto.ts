import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber } from 'class-validator'

export class AssignRolesDto {
  @ApiProperty({
    description: 'Array of role IDs to assign to the user',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[]
}
