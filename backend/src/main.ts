import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: true,
        }),
    );

    // Compression - gzip/brotli
    await app.register(fastifyCompress, {
        global: true,
        encodings: ['gzip', 'deflate'],
    });

    // Cookies
    await app.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET || 'the-insight-compass-secret-key',
        hook: 'onRequest',
    });

    // CORS for frontend
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global prefix
    app.setGlobalPrefix('api/v1');

    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Application running on: http://localhost:${port}/api/v1`);
    logger.log(`📦 Compression: enabled (gzip/deflate)`);
    logger.log(`🍪 Cookies: enabled`);
    logger.log(`💾 Cache: enabled`);
}

bootstrap();
