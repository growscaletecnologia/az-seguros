import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    const isDev = process.env.API_MODE === 'DEV';
    const host = isDev ? 'localhost' : 'redis';
    const port = isDev ? 6380 : 6379;
    const password = process.env.REDIS_PASSWORD;

    this.client = new Redis({
      host,
      port,
      password,
      retryStrategy: (times) => Math.min(times * 100, 2000),
    });

    this.client.on('connect', () => console.log(`✅ Redis conectado: ${host}:${port}`));
    this.client.on('error', (err) => console.error(`❌ Redis erro:`, err.message));
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
