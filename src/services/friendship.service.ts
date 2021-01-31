import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipDTO } from 'src/models/dtos/friendship.dto';
import { MessageDTO } from 'src/models/dtos/message.dto';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { Friendship } from 'src/models/entities/friendship.entity';
import { PersonalMessage } from 'src/models/entities/personal_message.entity';
import { User } from 'src/models/entities/user.entity';
import { FriendshipStatus } from 'src/models/enums/friendship_status';
import { FriendshipRepository } from 'src/repository/friendship.repository';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class FriendshipService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                private friendRepository: FriendshipRepository) {

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

    async getFriendshipByUsersIds(userId1: string, userId2: string): Promise<Friendship> {  // In custom repository 
        const friendship = await this.friendRepository.getFriendshipByUsersIds(userId1, userId2);
                            
        return friendship;
    }

    // Devuelve la lista de Friendship pasandole el userId.
    async getFriendsByUserId(userId: string): Promise<Array<FriendshipDTO>> { // In custom repository 
        
        try {

            const friendships= await this.friendRepository.getFriends(userId);

            let friendshipsDTO = new Array<FriendshipDTO>();
            for(const friendship of friendships){
                const friendDTO = (friendship.receiver.id === userId) ? 
                new FriendshipDTO(friendship.id, friendship.sender, friendship.registeredAt, friendship.messages) : 
                new FriendshipDTO(friendship.id, friendship.receiver, friendship.registeredAt, friendship.messages);
                friendshipsDTO.push(friendDTO);
            }
            
            return friendshipsDTO;
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
    async getRequestsByUserId(userId: string): Promise<Array<FriendshipDTO>> {  // In custom repository

        try {

            const friendRequest = await this.friendRepository.getRequest(userId);

                return friendRequest;
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
