// import { Injectable, OnModuleDestroy } from '@nestjs/common'
// import Redis from 'ioredis'

// @Injectable()
// export class RedisService implements OnModuleDestroy {
//   private client: Redis

//   constructor() {
//     this.client = new Redis({
//       host: process.env.REDIS_HOST || 'redis',
//       port: parseInt(process.env.REDIS_PORT || '6380'),
//       password: process.env.REDIS_PASSWORD,
//     })
//     console.log('Redis connected', this.client)
//   }

//   getClient(): Redis {
//     return this.client
//   }

//   async onModuleDestroy() {
//     await this.client.quit()
//   }
// }

import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'
@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    const isDev = process.env.API_MODE === 'DEV';

    const host = isDev ? 'localhost' : 'redis';
    const port = isDev ? 6380 : 6379;

    this.client = new Redis({
      host,
      port,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('connect', () => console.log('✅ Redis conectado:', host, port));
    this.client.on('error', (err) => console.error('❌ Erro Redis:', err.message));
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
