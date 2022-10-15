import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { typeOrmModuleOptions } from './config/orm.config';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { AppLoggerMiddleware } from './middleware/appLogger.middleware';
import { NftsModule } from './api/nfts/nfts.module';
import { CollectionsModule } from './api/collections/collections.module';
import { join } from 'path';
import { OffersModule } from './api/offers/offers.module';
import { ListingsModule } from './api/listings/listings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        ...typeOrmModuleOptions,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    NftsModule,
    CollectionsModule,
    OffersModule,
    ListingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
