import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendDTO } from 'src/models/dtos/friend.dto';
import { UserDTO } from 'src/models/dtos/user.dto';
import { Friendship } from 'src/models/entities/friend.entity';
import { FriendRequest } from 'src/models/entities/friend_request.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class FriendshipService {

    constructor(@InjectRepository(Friendship) private friendShipRepository: Repository<Friendship>, @InjectRepository(FriendRequest) private requestRepository: Repository<FriendRequest> , private userService: UserService) {

    }

    // nueva solicitud de amistad (emisor, receptor)
    async newRequest(userDto: UserDTO, requesterDto: UserDTO): Promise<FriendRequest> {

        const user =  await this.userService.getById(userDto.id);
        const requester =  await this.userService.getById(requesterDto.id);

        if(!user) throw new NotFoundException("User not found with id:" + userDto.id);
        if(!requester) throw new NotFoundException("FriendShip not found with id:" + requesterDto.id);

        const request = new FriendRequest(user, requester);

        return this.requestRepository.save(request);
    }

    // devuelve todas las request de un usuario
    async getRequests(userId: string): Promise<Array<FriendDTO>> {

        const user = await this.userService.getById(userId);
        if(!user) throw new NotFoundException();
        const friendRequests = await this.requestRepository.find({ requested: user });
        
        let requests: Array<FriendDTO>;
        for(const friendRequest of friendRequests) {
            requests.push(new FriendDTO(friendRequest.user.id, friendRequest.user.username, friendRequest.user.isOnline, friendRequest.user.socketId));
        }

        return requests;
    }

    // devuelve una request por el id de la request
    async getRequestById(idRequest: string): Promise<FriendRequest> {

        const request = await this.requestRepository.findOne(idRequest);

        if(!request) throw new NotFoundException(`Request with id ${idRequest} not found`);
        
        return request;
    }

    async getAllFriends(userId: string): Promise<Array<FriendDTO>> {

        let friends = new Array<FriendDTO>();
        const user = await this.userService.getById(userId);

        if(!user) throw new NotFoundException(`User with id ${userId} not found`);
        const friendShips = await this.friendShipRepository.find({ user: user });
        
        for(let friend of friendShips) {
            console.log(friendShips);
            
            friends.push(new FriendDTO(friend.friend.id, friend.friend.username, friend.friend.isOnline, friend.friend.socketId));
        }

        return friends;
    }

    async acceptFriendRequest(idRequest: string): Promise<boolean> {

        const request = await this.requestRepository.findOne(idRequest);
        

        if(!request) {
            throw new NotFoundException(`Request with id ${idRequest} not found`);
        }

        
        const friendShip = new Friendship(request.user, request.requested);
        const reverseFriendShip = new Friendship(request.requested, request.user);

        this.friendShipRepository.save(friendShip);
        this.friendShipRepository.save(reverseFriendShip);
        this.requestRepository.delete(idRequest);

        return !!request;
    }

    async rejectFriendShip(idRequest: string): Promise<DeleteResult> {

        return await this.requestRepository.delete(idRequest);
    }
}
