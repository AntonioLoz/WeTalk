import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/models/entities/friend.entity';
import { FriendService } from 'src/services/friend.service';
import { UserService } from 'src/services/user.service';
import { UsersModule } from './users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Friend]),
        UsersModule
    ],
    providers: [
        FriendService
    ],
    exports: [
        FriendService
    ],
    
})
export class FriendsModule {}
