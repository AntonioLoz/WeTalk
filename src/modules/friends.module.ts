import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipController } from 'src/controllers/friendship.controller';
import { Friendship } from 'src/models/entities/friendship.entity';
import { User } from 'src/models/entities/user.entity';
import { FriendshipService } from 'src/services/friendship.service';
import { UsersModule } from './users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Friendship, User]),
    ],
    providers: [
        FriendshipService
    ],
    exports: [
        FriendshipService
    ],
    controllers: [
        FriendshipController
    ]
    
})
export class FriendshipModule {}
