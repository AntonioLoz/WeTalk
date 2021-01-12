import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from 'src/models/entities/friend_request.entity';
import { FriendRequestService } from 'src/services/friend_request.service';
import { UsersModule } from './users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([FriendRequest]),
        UsersModule
    ],
    providers: [
        FriendRequestService
    ],
    exports: [
        FriendRequestService
    ]
})
export class FriendRequestModule {}
