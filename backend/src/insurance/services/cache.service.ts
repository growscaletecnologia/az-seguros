import { Injectable, Logger } from '@nestjs/common';

import prisma from 'src/prisma/client';
import { RedisService } from 'src/redis/redis.service';

interface CacheValue<T> {
  data: T;
  timestamp: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly TTL = 15 * 60; // 15 minutos
  private readonly STALE_TTL = 5 * 60;
  private readonly REVALIDATION_LOCK_TTL = 30;

  constructor(private readonly redisService: RedisService) {}

  private get redis() {
    return this.redisService.getClient();
  }

  async get<T>(key: string, revalidate?: () => Promise<T>): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      console.log('[CacheService] Redis GET', key, '=>', data);
      if (!data) return null;

      const cached = JSON.parse(data) as CacheValue<T>;
      const age = Date.now() - cached.timestamp;
      console.log('[CacheService] Cache age:', age, 'ms');

      if (age < this.STALE_TTL * 1000) {
        console.log('[CacheService] Cache is fresh, returning data');
        return cached.data;
      }

      if (revalidate) {
        console.log('[CacheService] Cache is stale, revalidating in background');
        this.revalidateInBackground(key, revalidate);
      }
      return cached.data;
    } catch (error) {
      this.logger.error(`Erro ao ler cache: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.TTL): Promise<void> {
    try {
      const cacheValue: CacheValue<typeof value> = {
        data: value,
        timestamp: Date.now(),
      };

      console.log('[CacheService] Redis SET', key, cacheValue);
      await this.redis.multi()
        .set(key, JSON.stringify(cacheValue))
        .expire(key, ttl)
        .exec();

      try {
        await prisma.insuranceCache.create({
          data: {
            id: key,
            insurerId: value.insurerId,
            destination: value.destination,
            paxCount: value.paxCount,
            ageGroup: value.ageGroup,
            days: value.days,
            data: value,
          },
        });
        console.log('[CacheService] Saved to InsuranceCache table:', key);
      } catch (err) {
        console.log('[CacheService] Error saving to InsuranceCache table:', err);
      }
    } catch (error) {
  this.logger.error(`Erro ao gravar cache: ${error.message}`);
  console.log('[CacheService] Error on set:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
  await this.redis.del(key);
  console.log('[CacheService] Redis DEL', key);
  await prisma.insuranceCache.delete({ where: { id: key } });
  console.log('[CacheService] Deleted from InsuranceCache table:', key);
    } catch (error) {
  this.logger.error(`Erro ao deletar cache: ${error.message}`);
  console.log('[CacheService] Error on del:', error);
    }
  }

  generateQuoteKey(params: {
    destination: string;
    paxCount: number;
    ageGroup: string;
    days: number;
    insurerId: string;
  }): string {
    const { destination, paxCount, ageGroup, days, insurerId } = params;
  const key = `QUOTE:${destination}:${paxCount}:${ageGroup}:${days}:${insurerId}`;
  console.log('[CacheService] Generated quote key:', key);
  return key;
  }

  private async revalidateInBackground<T>(
    key: string,
    revalidate: () => Promise<T>
  ): Promise<void> {
    const lockKey = `lock:${key}`;
    const acquired = await this.redis.setnx(lockKey, '1');
    console.log('[CacheService] Revalidation lock acquired:', acquired);
    if (acquired) await this.redis.expire(lockKey, this.REVALIDATION_LOCK_TTL);
    else {
      console.log('[CacheService] Revalidation lock not acquired, skipping');
      return;
    }

    try {
      const freshData = await revalidate();
      await this.set(key, freshData);
      this.logger.debug(`Revalidação concluída para: ${key}`);
      console.log('[CacheService] Revalidation completed for:', key);
    } catch (error) {
      this.logger.error(`Erro revalidando ${key}: ${error.message}`);
      console.log('[CacheService] Error revalidating:', error);
    } finally {
      await this.redis.del(lockKey);
      console.log('[CacheService] Revalidation lock deleted:', lockKey);
    }
  }
}
