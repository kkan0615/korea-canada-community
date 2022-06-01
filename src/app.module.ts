import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BuyAndSellModule } from './buy-and-sell/buy-and-sell.module';

@Module({
  imports: [
    /* Config */
    ConfigModule.forRoot(),
    /* Database */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BuyAndSellModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
