import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // Database
        DATABASE_URL: Joi.string().required(),

        // Redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().allow(''),

        // Encryption
        ENCRYPTION_KEY: Joi.string().required(),

        // Security Timeouts
        TOKEN_RENEWAL_THRESHOLD: Joi.number().default(300),
        CACHE_TTL: Joi.number().default(900),
        REQUEST_TIMEOUT: Joi.number().default(10000),

        // Insurance API URLs
        HERO_API_URL: Joi.string().required(),
        TRAVEL_API_URL: Joi.string().required(),

        // Metrics and Monitoring
        ENABLE_METRICS: Joi.boolean().default(true),
        METRICS_PREFIX: Joi.string().default('insurance_module'),

        // Rate Limiting
        RATE_LIMIT_TTL: Joi.number().default(60),
        RATE_LIMIT_MAX: Joi.number().default(100),

        // Error Handling
        MAX_RETRIES: Joi.number().default(3),
        RETRY_DELAY_BASE: Joi.number().default(1000),
      }),
    }),
  ],
})
export class AppConfigModule {}