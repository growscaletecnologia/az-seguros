import { Module } from '@nestjs/common'
import { CmdService } from './cmd.service'
import { CmdController } from './cmd.controller'

@Module({
  controllers: [CmdController],
  providers: [CmdService],
})
export class CmdModule {}
