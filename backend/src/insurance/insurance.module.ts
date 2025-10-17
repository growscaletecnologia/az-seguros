import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { QuoteController } from './controllers/quote.controller'
import { PlanController } from './controllers/plan.controller'
import { QuoteService } from './services/quote.service'
import { CacheService } from './services/cache.service'
import { TokenService } from './services/token.service'
import { HeroConnector } from './connectors/hero.connector'
import { MTAConnector } from './connectors/mta.connector'
import { PlanService } from './services/plan.service'
import { CouponsService } from 'src/coupons/coupons.service'
import { CouponsModule } from 'src/coupons/coupons.module'



@Module({
  imports: [ConfigModule, CouponsModule],
  controllers: [QuoteController, PlanController],
  providers: [QuoteService, CacheService, TokenService, HeroConnector, MTAConnector, PlanService],
  exports: [QuoteService],
})
export class InsuranceModule {}
