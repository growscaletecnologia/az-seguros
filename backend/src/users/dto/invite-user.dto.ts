import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, Length } from 'class-validator'

export class InviteUserDto {
  @ApiProperty({
    description: 'Email of the user to invite',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Name of the user to invite',
    example: 'John Doe',
  })
  @IsString()
  @Length(2, 100)
  name: string

  @ApiProperty({
    description: 'Array of role IDs to assign to the invited user',
    example: [2],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[]

  @ApiProperty({
    description: 'Custom message to include in the invitation email',
    example: 'Please join our platform as a manager.',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string
}
