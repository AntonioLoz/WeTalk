import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UsersModule } from './users.module';

@Module({
    imports: [
        UsersModule
    ],
    providers: [JwtStrategy],
    exports: [JwtStrategy]
})
export class StrategyModule {}
