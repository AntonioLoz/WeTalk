import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendDTO } from 'src/models/dtos/friend.dto';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { Friendship } from 'src/models/entities/friend.entity';
import { FriendRequest } from 'src/models/entities/friend_request.entity';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class FriendshipService {

    // Inyectamos Connection para poder hacer uso de QueryRunner y así tener control sobre las 
    // transacciones. 
    constructor(
        @InjectRepository(Friendship) private friendShipRepository: Repository<Friendship>, 
        @InjectRepository(FriendRequest) private requestRepository: Repository<FriendRequest>, 
        private userService: UserService,
        private connection: Connection) {

    }

    // nueva solicitud de amistad (emisor, receptor).
    async newRequest(requestFriend: RequestFriendDTO): Promise<FriendRequest> {

        const user =  await this.userService.getById(requestFriend.idUser);
        const requested =  await this.userService.getById(requestFriend.idRequested);

        if(!user) throw new Error(`User with id ${requestFriend.idUser} not found`);
        if(!requested) throw new Error(`Requested with id ${requestFriend.idRequested} not found`);

        const request = new FriendRequest(user, requested);

        return this.requestRepository.save(request);
    }

    // devuelve la lista de FriendRequest pasandole el userId.
    async getRequestsByUserId(userId: string): Promise<Array<FriendRequest>> {

        const user = await this.userService.getById(userId);
        if(!user) throw new Error(`User with id ${userId} not found`);

        const requests = await this.requestRepository.find({ requested: user });        

        return requests;
    }

    // todo: ¿por user id o por user? con user evitaria la inyección de UserService.
    // Devuelve la lista de Friendship pasandole el userId.
    async getFriendsByUserId(userId: string): Promise<Array<Friendship>> {

        const user = await this.userService.getById(userId);

        if(!user) throw new Error(`User with id ${userId} not found`);
        const friends = await this.friendShipRepository.find({ user: user });

        return friends;
    }

    // Acepta un FriendRequest pasandole el id de este por parametro
    // la operacion se hace en una unica transaccion mediante el
    // uso de QueryRunner (Todo o nada).
    async acceptFriendRequest(idRequest: string): Promise<Friendship> {

        const queryRunner = this.connection.createQueryRunner();
        const friendRequest = await queryRunner.manager.findOneOrFail(FriendRequest, idRequest);
        let friendship: Friendship;
        
        if(!friendRequest) throw new Error("Friend request not found");
        
        await queryRunner.startTransaction();

        try {
            
            
            await queryRunner.manager.save<Friendship>(new Friendship(friendRequest.user, friendRequest.requested));
            friendship = await queryRunner.manager.save<Friendship>(new Friendship(friendRequest.requested, friendRequest.user));
            await queryRunner.manager.remove<FriendRequest>(friendRequest);
            await queryRunner.commitTransaction();
        } catch (error) {
            
            queryRunner.rollbackTransaction(); 
            throw new Error(error);
                       
        } finally {
            queryRunner.release();
        }

        return friendship;
    }

    // Rechaza un FriendRequest pasandole el id de este por parametro
    // la operacion se hace en una unica transaccion mediante el
    // uso de QueryRunner (Todo o nada).
    async rejectRequest(idRequest: string): Promise<DeleteResult> {

        return await this.requestRepository.delete(idRequest);
    }

    async deleteFriendship(idFriendship: string): Promise<Friendship> {

        const queryRunner = this.connection.createQueryRunner();
        let friendship: Friendship;

        await queryRunner.startTransaction();
        try {
            
            const friendRequest = await queryRunner.manager.findOneOrFail(Friendship, idFriendship);
            friendship = await queryRunner.manager.remove<Friendship>(friendRequest);
            await queryRunner.commitTransaction();
        } catch (error) {
            queryRunner.rollbackTransaction();
            throw new Error(error);
        } finally {
            queryRunner.release();
        }
        return friendship;
    }
}
