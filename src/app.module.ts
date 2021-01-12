import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './modules/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './modules/test.module';
import { FriendsModule } from './modules/friends.module';
import { FriendRequestModule } from './modules/friend_request.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    ConfigModule.forRoot(),
    AuthModule,
    RoomModule,
    TestModule,
    FriendsModule,
    FriendRequestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
