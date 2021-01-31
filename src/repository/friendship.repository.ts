import { Friendship } from "src/models/entities/friendship.entity";
import { FriendshipStatus } from "src/models/enums/friendship_status";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Friendship)
export class FriendshipRepository extends Repository<Friendship> {

    // TODO: Pensar en paginaciones para los mensajes
    // TODO: tambien se podria separar en getFriends y en getMessages(idFriendship)
    async getFriends(userId: string): Promise<Array<Friendship>> {
        
        try {

            const friendships= await this
                .createQueryBuilder('friendship')
                .innerJoinAndSelect('friendship.sender', 'sender')
                .innerJoinAndSelect('friendship.receiver', 'receiver')
                .leftJoinAndSelect('friendship.messages', 'messages')
                .leftJoinAndSelect('messages.sender', '_sender')
                .leftJoinAndSelect('messages.receiver', '_receiver')
                .where('sender.id = :id', { id: userId})
                .orWhere('receiver.id = :id', { id: userId})
                .andWhere('friendship.status = :status', { status: FriendshipStatus.accepted })
                .getMany();

                return friendships

        }
        catch(error) {
            throw new Error(error);
        }
    }

    async getRequest(userId: string): Promise<Array<Friendship>> {

        try {

            const friendRequest = await this
                .createQueryBuilder('friendship') // friendship es el alias (select f from friends f where...)
                .innerJoinAndSelect('friendship.receiver', 'user', 'user.id = :id', { id: userId}) // con innerJoin devuelve los friendship que tengan usuarios
                                                                                                // con leftJoin devuelve los friendship tengan o no usuarios
                                                                                                // user será el alias de la tabla users a la que apunta nuestra relación.
                .innerJoinAndSelect('friendship.sender', 'sender')
                .where('friendship.status = :status', { status: FriendshipStatus.pending })
                .select(['friendship.id', 'sender', 'friendship.status', 'friendship.registeredAt'])
                .getMany();

                return friendRequest;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getFriendshipByUsersIds(userId1: string, userId2: string): Promise<Friendship> {
        const friendship = await this
                .createQueryBuilder('friendship')
                .innerJoinAndSelect('friendship.sender', 'sender')
                .innerJoinAndSelect('friendship.receiver', 'receiver')
                .leftJoinAndSelect('friendship.messages', 'messages')
                .where('sender.id = :id1 AND receiver.id = :id2 OR sender.id = :id2 AND receiver.id = :id1', { id1: userId1, id2: userId2 })
                .getOne();
                            
        return friendship;
    }
}