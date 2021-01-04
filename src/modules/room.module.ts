import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { RoomGateway } from 'src/websockets/gateways/room.gateway';
import { StrategyModule } from './strategy.module';
import { UsersModule } from './users.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h'},
        })
    ],
    providers: [
        RoomGateway,
    ]
})
export class RoomModule {}
