import { Module } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { BenefitsRepository } from './benefits.repository';

@Module({
  controllers: [BenefitsController],
  providers: [BenefitsService, BenefitsRepository] ,
})
export class BenefitsModule {}
