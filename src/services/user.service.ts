import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendDTO } from 'src/models/dtos/friend.dto';
import { UserDTO } from 'src/models/dtos/user.dto';
import { User } from 'src/models/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private repository: Repository<User>){

    }

    async getAll(): Promise<Array<User>> {
        return await this.repository.find();
    }

    async getById(id: string): Promise<User> {
        return await this.repository.findOne(id);
    }

    async getByUsername(username: string): Promise<User> {
        return await this.repository.findOne({ where: { username: username }});
    }

    async save(user: User): Promise<User> {

        return await this.repository.save(user)
    }

    // todo: completar
    async update(id: string, user: User): Promise<UpdateResult> {
        const toUpdate = await this.repository.findOne(id);
    
        if (!toUpdate) {
          throw new NotFoundException('User not found with id: ' + id);
        }
    
        toUpdate.username = user.username;
        toUpdate.password = user.password;
        toUpdate.socketId = user.socketId;
    
        
        return this.repository.update({ id: id }, {});;
    }

    async getFriendships(userId: string): Promise<Array<FriendDTO>> {
        
        const friends = new Array<FriendDTO>(); 
        const user = await this.repository.findOne(userId);
        let friendDto: FriendDTO;

        if(!user) {
            throw new NotFoundException("User not found: " + userId);
        }

        user.friends.forEach( (friendship) => {
            friendDto = new FriendDTO(friendship.friend.id, friendship.friend.username);
            friends.push(friendDto);
        });

        return friends;
    }

    async getFriendRequests(userId: string): Promise<Array<FriendDTO>> {

        const friends = new Array<FriendDTO>(); 
        const user = await this.repository.findOne(userId);
        let friendDto: FriendDTO;
        
        if(!user) {
            throw new NotFoundException("User not found: " + userId);
        }

        user.friendRequests.forEach( (friendship) => {
            
            friendDto = new FriendDTO(friendship.requester.id, friendship.requester.username);
            friends.push(friendDto);
        });

        return friends;
    }

    async setUserConnection(userId: string, isOnline: boolean, socketId?: string,): Promise<UpdateResult> {
        
        let user = await this.repository.findOne(userId);
        
        if(!user) {
            throw new NotFoundException("User not found: " + userId);
        }

        user.isOnline = isOnline;
        user.socketId = socketId;
        const updateResult = await this.repository.update({id: userId}, {isOnline: isOnline, socketId: socketId});

        return updateResult;
    }
}
