import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginController } from 'src/controllers/login.controller';
import { AuthService } from 'src/services/auth.service';
import { UsersModule } from './users.module';
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
      ConfigModule.forRoot(),
      UsersModule,
      PassportModule,
      JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h'},
      }),
    ],
    controllers: [LoginController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
