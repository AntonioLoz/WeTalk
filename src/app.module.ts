import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './modules/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    ConfigModule.forRoot(),
    AuthModule,
    RoomModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
