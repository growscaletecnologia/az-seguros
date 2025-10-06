import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { QuoteController } from './controllers/quote.controller';
import { QuoteService } from './services/quote.service';
import { CacheService } from './services/cache.service';
import { TokenService } from './services/token.service';
import { HeroConnector } from './connectors/hero.connector';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [QuoteController],
  providers: [
    QuoteService,
    CacheService,
    TokenService,
    HeroConnector,
  ],
  exports: [QuoteService],
})
export class InsuranceModule {}