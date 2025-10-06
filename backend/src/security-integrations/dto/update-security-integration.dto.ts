import { PartialType } from '@nestjs/swagger'
import { CreateSecurityIntegrationDto } from './create-security-integration.dto'

export class UpdateSecurityIntegrationDto extends PartialType(CreateSecurityIntegrationDto) {}
