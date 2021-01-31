import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipController } from 'src/controllers/friendship.controller';
import { User } from 'src/models/entities/user.entity';
import { FriendshipRepository } from 'src/repository/friendship.repository';
import { FriendshipService } from 'src/services/friendship.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FriendshipRepository, User]),
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
