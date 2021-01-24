import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { Friendship } from 'src/models/entities/friendship.entity';
import { User } from 'src/models/entities/user.entity';
import { FriendshipStatus } from 'src/models/enums/friendship_status';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class FriendshipService {

    // Inyectamos Connection para poder hacer uso de QueryRunner y así tener control sobre las 
    // transacciones. 
    constructor(@InjectRepository(Friendship) private friendRepository: Repository<Friendship>,
                @InjectRepository(User) private userRepository: Repository<User>) {

    }

    // nueva solicitud de amistad (emisor, receptor).
    async newRequest(requestFriend: RequestFriendDTO): Promise<Friendship> {
        
        const user1 = await this.userRepository.findOne(requestFriend.idUser1);
        const user2 = await this.userRepository.findOne(requestFriend.idUser2);

        if(!user1) throw new Error(`User with id ${requestFriend.idUser1} not found`);
        if(!user2) throw new Error(`User with id ${requestFriend.idUser2} not found`);

        const friendship = new Friendship(new Array<User>(user1, user2));

        return this.friendRepository.save(friendship); 
    }

    // devuelve la lista de FriendRequest pasandole el userId.
    async getRequestsByUserId(userId: string): Promise<Array<Friendship>> {

        try {

            const friendRequestIds = await this.friendRepository
                .createQueryBuilder('friendship') // friendship es el alias (select f from friends f where...)
                .innerJoinAndSelect('friendship.users', 'user', 'user.id = :id', { id: userId}) // con innerJoin devuelve los friendship que tengan usuarios
                                                                                                // con leftJoin devuelve los friendship tengan o no usuarios
                                                                                                // user será el alias de la tabla users a la que apunta nuestra relación.
                .where('friendship.status = :status', { status: FriendshipStatus.pending })
                .select(['friendship.id'])
                .getMany();

                let friendRequests = new Array<Friendship>();
                for(const friendRequestId of friendRequestIds){  
                    friendRequests.push(await this.friendRepository.findOne(friendRequestId.id));
                }

        return friendRequests;
        } catch (error) {
            throw new Error(error);
        }
    }

    // todo: ¿por user id o por user? con user evitaria la inyección de UserService.
    // Devuelve la lista de Friendship pasandole el userId.
    async getFriendsByUserId(userId: string): Promise<Array<Friendship>> {
        
        try {

            const friendRequestIds = await this.friendRepository
                .createQueryBuilder('friendship')
                .innerJoinAndSelect('friendship.users', 'user', 'user.id = :id', { id: userId})
                .where('friendship.status = :status', { status: FriendshipStatus.accepted })
                .select(['friendship.id'])
                .getMany();

                let friendRequests = new Array<Friendship>();
                for(const friendRequestId of friendRequestIds){  
                    friendRequests.push(await this.friendRepository.findOne(friendRequestId.id));
                }

        return friendRequests;
        } catch (error) {
            throw new Error(error);
        }

    }

    // Acepta un FriendRequest pasandole el id de este por parametro
    async acceptFriendRequest(idFriendship: string, userId: string): Promise<UpdateResult> {

        try {
            const friendship = await this.isUserInFriendship(idFriendship, userId);
            let result: UpdateResult
            if(friendship && friendship.status === FriendshipStatus.pending) {
                result = await this.friendRepository.update({ id: idFriendship }, { status: FriendshipStatus.accepted });
                if(result.affected === 0) throw new Error(`Friendship with id ${idFriendship} not updated`);
                
            }
            else {
                throw new Error(`Friendship with id ${idFriendship} not updated`);
            }

            return result;

        } catch (error) {
            throw new Error(error);
        }
    }

    // Rechaza un FriendRequest pasandole el id de este por parametro
    async rejectRequest(idFriendship: string, userId: string): Promise<UpdateResult> {

        try {
            const friendship = await this.isUserInFriendship(idFriendship, userId);
            if(!(friendship && friendship.status === FriendshipStatus.pending)) throw new Error(`Friendship with id ${idFriendship} not updated`);
            const result = await this.friendRepository.update({ id: idFriendship }, { status: FriendshipStatus.reject });
            if(result.affected === 0) throw new Error(`Friendship with id ${idFriendship} not updated`);

            return result;

        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteFriendship(idFriendship: string, userId: string): Promise<Friendship> {

        try {
            const friendship = await this.isUserInFriendship(idFriendship, userId);
            let result: Friendship
            if(friendship && friendship.status === FriendshipStatus.accepted) {
                result = await this.friendRepository.remove(friendship);
                
            }
            else {
                throw new Error(`Friendship with id ${idFriendship} not deleted`);
            }

            return result;

        } catch (error) {
            throw new Error(error);
        }
    }

    private async isUserInFriendship(frienshipId: string, userId: string): Promise<Friendship | null> {

        const friendship = await this.friendRepository.findOne(frienshipId);
        
         
         return (friendship.users[0].id === userId || friendship.users[1].id === userId) ? friendship : null
    }
}
