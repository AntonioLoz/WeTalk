import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipController } from 'src/controllers/friendship.controller';
import { Friendship } from 'src/models/entities/friend.entity';
import { FriendRequest } from 'src/models/entities/friend_request.entity';
import { FriendshipService } from 'src/services/friend.service';
import { UsersModule } from './users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Friendship, FriendRequest]),
        UsersModule,
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
