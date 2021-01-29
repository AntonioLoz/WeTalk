import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/entities/user.entity';
import { FriendshipStatus } from 'src/models/enums/friendship_status';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private repository: Repository<User>){

    }

    // todo: Retornar UserDTO
    async getAll(): Promise<Array<User>> {
        return await this.repository.find();
    }

    async getById(id: string): Promise<User> {

        const user = await this.repository.findOne(id);
        if(!user) throw new NotFoundException(`User with id ${id} not found.`);

        return user;
    }

    async getByUsername(username: string): Promise<User> {
        const user = await this.repository.findOne({ where: { username: username }});
        if(!user) throw new NotFoundException(`User with username ${username} not found`)
        return user;
    }

    async save(user: User): Promise<User> {

        return await this.repository.save(user)
    }

    async update(id: string, user: User): Promise<UpdateResult> {
        const toUpdate = await this.repository.findOne(id);
    
        if (!toUpdate) {
          throw new NotFoundException('User not found with id: ' + id);
        }
    
        toUpdate.username = user.username;
        toUpdate.password = user.password;
        toUpdate.socketId = user.socketId;
    
        
        return this.repository.update({ id: id }, {});
    }

    async updateUserConnection(userId: string, isOnline: boolean, socketId?: string,): Promise<UpdateResult> {
        
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
