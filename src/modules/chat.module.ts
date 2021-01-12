import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ChatGateway } from 'src/websockets/gateways/chat.gateway';
import { UsersModule } from './users.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        UsersModule,
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
