import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { PermissionGuard } from 'src/rbac/guards/permission.guard'
import { InvitationService } from '../services/invitation.service'
import { InviteUserDto } from '../dto/invite-user.dto'

@ApiTags('User Invitations')
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @ApiOperation({ summary: 'Invite a new user' })
  inviteUser(@Body() inviteUserDto: InviteUserDto) {
    console.log('inviteUserDto', inviteUserDto)
    return this.invitationService.createInvitation(inviteUserDto)
  }

  @Post('accept/:token')
  @ApiOperation({ summary: 'Accept a user invitation' })
  acceptInvitation(@Param('token') token: string, @Body('password') password: string) {
    return this.invitationService.acceptInvitation(token, password)
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('resend/:userId')
  @ApiOperation({ summary: 'Resend an invitation to a user' })
  resendInvitation(@Param('userId') userId: string) {
    return this.invitationService.resendInvitation(userId)
  }
}
