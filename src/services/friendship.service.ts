import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { Friendship } from 'src/models/entities/friendship.entity';
import { User } from 'src/models/entities/user.entity';
import { FriendshipStatus } from 'src/models/enums/friendship_status';
import { Repository, UpdateResult } from 'typeorm';

// TODO: Sopesar la posibilidad de abstraer las operaciones de bbdd en un custom repository 

@Injectable()
export class FriendshipService {

    constructor(@InjectRepository(Friendship) private friendRepository: Repository<Friendship>,
                @InjectRepository(User) private userRepository: Repository<User>) {

    }

    // nueva solicitud de amistad (emisor, receptor).
    async newRequest(requestFriend: RequestFriendDTO): Promise<Friendship> {
        
        const sender = await this.userRepository.findOne(requestFriend.senderId);
        const receiver = await this.userRepository.findOne(requestFriend.receiverId);

        if(!sender) throw new Error(`User with id ${requestFriend.senderId} not found`);
        if(!receiver) throw new Error(`User with id ${requestFriend.receiverId} not found`);

        const friendship = new Friendship(sender, receiver);

        return this.friendRepository.save(friendship); 
    }

    // devuelve la lista de FriendRequest pasandole el userId.
    async getRequestsByUserId(userId: string): Promise<Array<Friendship>> {

        try {

            const friendRequestIds = await this.friendRepository
                .createQueryBuilder('friendship') // friendship es el alias (select f from friends f where...)
                .innerJoinAndSelect('friendship.receiver', 'user', 'user.id = :id', { id: userId}) // con innerJoin devuelve los friendship que tengan usuarios
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
                .innerJoinAndSelect('friendship.sender', 'sender')
                .innerJoinAndSelect('friendship.receiver', 'receiver')
                .where('friendship.status = :status', { status: FriendshipStatus.accepted })
                .andWhere('sender.id = :id', { id: userId})
                .orWhere('receiver.id = :id', { id: userId})
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
    async acceptFriendRequest(friendshipId: string, userId: string): Promise<UpdateResult> {

        try {
            const friendship = await this.friendRepository.findOne(friendshipId)
            if(!(friendship && friendship.status === FriendshipStatus.pending && friendship.receiver.id === userId)) throw new Error(`Friendship with id ${friendshipId} not updated`);
            const result = await this.friendRepository.update({ id: friendshipId }, { status: FriendshipStatus.accepted });
            if(result.affected <= 0) throw new Error(`Friendship with id ${friendshipId} not updated`);
                
            return result;
            

        } catch (error) {
            throw new Error(error);
        }
    }

    // Rechaza un FriendRequest pasandole el id de este por parametro
    async rejectRequest(friendshipId: string, userId: string): Promise<UpdateResult> {

        try {
            const friendship = await this.friendRepository.findOne(friendshipId)

            if(!(friendship && friendship.status === FriendshipStatus.pending && friendship.receiver.id === userId)) throw new Error(`Friendship with id ${friendshipId} not updated`);
            const result = await this.friendRepository.update({ id: friendshipId }, { status: FriendshipStatus.rejected });
            if(result.affected <= 0) throw new Error(`Friendship with id ${friendshipId} not updated`);
                
            return result;
            

        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteFriendship(friendshipId: string, userId: string): Promise<Friendship> {

        try {
            const friendship = await this.friendRepository.findOne(friendshipId)
            
            if(!(friendship && friendship.status === FriendshipStatus.accepted && (friendship.receiver.id === userId || friendship.sender.id === userId))) throw new Error(`Friendship with id ${friendshipId} not deleted`);
            const result = await this.friendRepository.remove(friendship);    
            if(!result) throw new Error(`Friendship with id ${friendshipId} not deleted`);
            return result;
            

        } catch (error) {
            throw new Error(error);
        }
    }
}
