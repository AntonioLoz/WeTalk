import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipDTO } from 'src/models/dtos/friendship.dto';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { UserDTO } from 'src/models/dtos/user.dto';
import { Friendship } from 'src/models/entities/friendship.entity';
import { User } from 'src/models/entities/user.entity';
import { FriendshipStatus } from 'src/models/enums/friendship_status';
import { Repository, UpdateResult } from 'typeorm';

// TODO: Sopesar la posibilidad de abstraer las operaciones de bbdd en un custom repository 
// TODO: Sopesar la posibilidad de que Friendship sea un agregado junto con User 
// en la que User seía la clave del agregado
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
    async getRequestsByUserId(userId: string): Promise<Array<FriendshipDTO>> {

        try {

            const friendRequestIds = await this.friendRepository
                .createQueryBuilder('friendship') // friendship es el alias (select f from friends f where...)
                .innerJoinAndSelect('friendship.receiver', 'user', 'user.id = :id', { id: userId}) // con innerJoin devuelve los friendship que tengan usuarios
                                                                                                // con leftJoin devuelve los friendship tengan o no usuarios
                                                                                                // user será el alias de la tabla users a la que apunta nuestra relación.
                .where('friendship.status = :status', { status: FriendshipStatus.pending })
                .select(['friendship.id'])
                .getMany();

                let friendRequests = new Array<FriendshipDTO>();
                for(const friendRequestId of friendRequestIds){
                    const friendship = await this.friendRepository.findOne(friendRequestId.id);
                    friendRequests.push(new FriendshipDTO(friendship.id, friendship.sender, friendship.registeredAt));
                }

        return friendRequests;
        } catch (error) {
            throw new Error(error);
        }
    }

    // Devuelve la lista de Friendship pasandole el userId.
    async getFriendsByUserId(userId: string): Promise<Array<FriendshipDTO>> {
        
        try {    

            const friendshipsIds = await this.friendRepository
                .createQueryBuilder('friendship')
                .innerJoinAndSelect('friendship.sender', 'sender')
                .innerJoinAndSelect('friendship.receiver', 'receiver')
                .where('sender.id = :id', { id: userId})
                .orWhere('receiver.id = :id', { id: userId})
                .andWhere('friendship.status = :status', { status: FriendshipStatus.accepted })
                .select(['friendship.id'])
                .getMany();
            
                let friendships = new Array<FriendshipDTO>();
                for(const friendRequestId of friendshipsIds) {
                    
                    const friendRequest = await this.friendRepository.findOne(friendRequestId.id);
                    
                    const friendDTO = (friendRequest.receiver.id === userId) ? 
                        new FriendshipDTO(friendRequest.id, friendRequest.sender, friendRequest.registeredAt) : new FriendshipDTO(friendRequest.id, friendRequest.receiver, friendRequest.registeredAt);
                    
                    friendships.push(friendDTO);
                }

        return friendships;
        } catch (error) {
            throw new Error(error);
        }

    }

    // Acepta un FriendRequest pasandole el id de este por parametro
    async acceptFriendRequest(friendshipId: string, userId: string): Promise<UpdateResult> {

        try {
            const friendship = await this.friendRepository.findOneOrFail(friendshipId)
            if(!(friendship.status === FriendshipStatus.pending && friendship.receiver.id === userId)) throw new Error(`Friendship with id ${friendshipId} not updated`);
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
            const friendship = await this.friendRepository.findOneOrFail(friendshipId)

            if(!(friendship.status === FriendshipStatus.pending && friendship.receiver.id === userId)) throw new Error(`Friendship with id ${friendshipId} not updated`);
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

    async getFriendsConnected(userId: string): Promise<Array<FriendshipDTO>> {
        let friendshipsDTO = new Array<FriendshipDTO>();
        const friendships = await this.getFriendsByUserId(userId);
                

        for(const friendship of friendships) {
            if (friendship.sender.isOnline) {
                const friendDTO = new FriendshipDTO(friendship.id, friendship.sender, friendship.registeredAt);
                friendshipsDTO.push(friendDTO);
            }
        }

        return friendshipsDTO;
    }
}
