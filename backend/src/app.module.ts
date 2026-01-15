import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ArtefactsModule } from './modules/artefacts/artefacts.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { UsersModule } from './modules/users/users.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        // Load environment variables
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // In-memory cache with 60 second TTL
        CacheModule.register({
            isGlobal: true,
            ttl: 5000, // 5 seconds
            max: 100,
        }),
        // MongoDB connection
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        ArtefactsModule,
        RelationshipsModule,
        UsersModule,
        AuditLogsModule,
        SettingsModule,
    ],
})
export class AppModule { }
