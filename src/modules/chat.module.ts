import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ChatGateway } from 'src/websockets/gateways/chat.gateway';
import { FriendshipModule } from './friends.module';
// import { FriendRequestModule } from './friend_request.module';
import { UsersModule } from './users.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        UsersModule,
        FriendshipModule,
        // FriendRequestModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h'},
        })
    ],
    providers: [
        ChatGateway
        
    ]
})
export class RoomModule {}
