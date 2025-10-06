import { Module } from '@nestjs/common'

import { SecurityIntegrationRepository } from './repositories/security-integration.repository'
import { SecurityIntegrationController } from './controllers/security-integration.controller'
import { SecurityIntegrationsService } from './services/security-integration.service'

@Module({
  controllers: [SecurityIntegrationController, SecurityIntegrationController],
  providers: [SecurityIntegrationsService, SecurityIntegrationRepository],
  exports: [SecurityIntegrationsService],
})
export class SecurityIntegrationsModule {}
