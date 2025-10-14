import { Module } from '@nestjs/common'
import { ValePayProvider } from './external/valePay/provider/valePay.provider'
import { ValePayService } from './external/valePay/service/valePay.service'

@Module({
  providers: [ValePayProvider, ValePayService],
  exports: [ValePayService],
})
export class InfrastructureModule {}
