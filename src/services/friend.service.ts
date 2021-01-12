import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/models/dtos/user.dto';
import { Friend } from 'src/models/entities/friend.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class FriendService {

    constructor(@InjectRepository(Friend) private repository: Repository<Friend>, private userService: UserService) {

    }

    async set(userId: string, requesterId: string): Promise<boolean> {

        const user = <UserDTO> await this.userService.getById(userId);
        const friend = <UserDTO> await this.userService.getById(requesterId);

        if(!user) throw new NotFoundException("User not found with id:" + userId);
        if(!friend) throw new NotFoundException("Requester not found with id:" + requesterId);

        const friendRequest = new Friend(user, friend);

        return !!this.repository.save(friendRequest);
    }

    async get(userId: string): Promise<Array<Friend>> {

        const user = await this.userService.getById(userId);
        if(!user) throw new NotFoundException("User not found with id:" + userId);

        return user.friends;
    }

    async delete(userId: string): Promise<DeleteResult> {

        const user = await this.userService.getById(userId);
        if(!user) throw new NotFoundException("User not found with id:" + userId);

        
        return this.repository.delete(userId);
    }
}
