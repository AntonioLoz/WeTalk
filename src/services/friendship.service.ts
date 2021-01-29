import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipDTO } from 'src/models/dtos/friendship.dto';
import { MessageDTO } from 'src/models/dtos/message.dto';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { UserDTO } from 'src/models/dtos/user.dto';
import { Friendship } from 'src/models/entities/friendship.entity';
import { PersonalMessage } from 'src/models/entities/personal_message.entity';
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

    async getFriendshipByUsersIds(userId1: string, userId2: string): Promise<Friendship> {
        const friendship = await this.friendRepository
                .createQueryBuilder('friendship')
                .innerJoinAndSelect('friendship.sender', 'sender')
                .innerJoinAndSelect('friendship.receiver', 'receiver')
                .leftJoinAndSelect('friendship.messages', 'messages')
                .where('sender.id = :id1 AND receiver.id = :id2 OR sender.id = :id2 AND receiver.id = :id1', { id1: userId1, id2: userId2 })
                // .andWhere('friendship.sender = :id', { id: userId2 })
                // .orWhere('friendship.receiver = :id', { id: userId2 })
                .getOne();
                            
        return friendship;
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
                for(const friendshipId of friendshipsIds) {
                    
                    const friendship = await this.friendRepository.findOne(friendshipId.id);
                    
                    const friendDTO = (friendship.receiver.id === userId) ? 
                        new FriendshipDTO(friendship.id, friendship.sender, friendship.registeredAt, friendship.messages) : new FriendshipDTO(friendship.id, friendship.receiver, friendship.registeredAt, friendship.messages);

                        friendship.messages = friendship.messages.sort(function(a,b){
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return a.createdAt.getTime() - b.createdAt.getTime();
                          });

                        
                    
                    friendships.push(friendDTO);
                }

        return friendships;
        } catch (error) {
            throw new Error(error);
        }

    }

    async getFriendsConnected(userId: string): Promise<Array<FriendshipDTO>> {
        let friendshipsDTO = new Array<FriendshipDTO>();
        const friendships = await this.getFriendsByUserId(userId);
                

        for(const friendship of friendships) {
            if (friendship.sender.isOnline) {
                const friendDTO = new FriendshipDTO(friendship.id, friendship.sender, friendship.registeredAt, friendship.messages);
                friendshipsDTO.push(friendDTO);
            }
        }

        return friendshipsDTO;
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
                    friendRequests.push(new FriendshipDTO(friendship.id, friendship.sender, friendship.registeredAt, friendship.messages));
                }

        return friendRequests;
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

    async createMessage(message: MessageDTO): Promise<boolean> {
        try {
            const friendship = await this.getFriendshipByUsersIds(message.receiver.id, message.sender.id);
            
            friendship.messages.push(new PersonalMessage(message.message, message.sender, message.receiver, friendship));
            await this.friendRepository.save(friendship);
            return true;
        }
        
        catch(error) {
            console.error(error);
            
        }
    }
}
