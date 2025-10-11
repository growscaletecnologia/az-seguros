import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { CacheService } from 'src/insurance/services/cache.service'

@Global()
@Module({
  providers: [RedisService, CacheService],
  exports: [RedisService, CacheService],
})
export class RedisModule {}
