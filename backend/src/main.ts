import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { VersioningType } from '@nestjs/common'
import session from 'express-session'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

function normalizeOrigins(envVal?: string | string[]) {
  if (!envVal) return []
  const arr = Array.isArray(envVal) ? envVal : envVal.split(',')
  return arr
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\/+$/, ''))
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('API de Faturamentos')
    .setDescription('Documentação API Asaas backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const ENV_ORIGINS = normalizeOrigins(process.env.FRONT_ORIGIN)
  const DEFAULT_ORIGINS = normalizeOrigins([
    'http://localhost:3000',
    'http://localhost:3001',
    'https://suaescola.net',
  ])
  const REGEX_ORIGINS: RegExp[] = [/\.ngrok-free\.app$/i, /\.vercel\.app$/i, /\.localhost:\d+$/i]
  const ALLOWLIST = new Set([...DEFAULT_ORIGINS, ...ENV_ORIGINS])

  app.enableCors({
    credentials: true, // cookies/autenticação cross-site exigem origin específico
    origin(origin, callback) {
      //eslint-disable-next-line
      if (!origin) return callback(null, true);

      //eslint-disable-next-line
      const cleaned = origin.replace(/\/+$/, '');

      //eslint-disable-next-line
      if (ALLOWLIST.has(cleaned)) return callback(null, true);

      if (REGEX_ORIGINS.some((rx) => rx.test(cleaned))) {
        //eslint-disable-next-line
        return callback(null, true);
      }
      //eslint-disable-next-line
      return callback(new Error(`CORS: origin não autorizado: ${origin}`));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
    optionsSuccessStatus: 204, // evita edge-cases com navegadores antigos
  })
  //// SESSIONS
  app.enableVersioning({
    type: VersioningType.URI,
  })
  app.use(
    session({
      secret: process.env.API_SECRET || 'secret-cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    }),
  )

  // prisma.use(async (params, next) => {
  //   if (params.model === 'User') {
  //     if (params.action === 'delete') {
  //       params.action = 'update';
  //       params.args['data'] = { deleted: true };
  //     }
  //     if (params.action === 'deleteMany') {
  //       params.action = 'updateMany';
  //       params.args['data'] = {
  //         ...params.args.data,
  //         deleted: true,
  //       };
  //     }
  //     if (params.action === 'findMany') {
  //       // sempre esconde os soft-deletados
  //       if (!params.args.where) {
  //         params.args.where = {};
  //       }
  //       params.args.where['deleted'] = false;
  //     }
  //     if (params.action === 'findUnique' || params.action === 'findFirst') {
  //       params.action = 'findFirst';
  //       params.args.where = {
  //         ...params.args.where,
  //         deleted: false,
  //       };
  //     }
  //   }

  //   return next(params);
  // });

  await app.listen(process.env.PORT ?? 5000)
}
bootstrap()
