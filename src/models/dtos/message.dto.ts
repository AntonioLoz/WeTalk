import { Friendship } from "../entities/friendship.entity";
import { User } from "../entities/user.entity";
import { FriendshipDTO } from "./friendship.dto";

export class MessageDTO {


    id: string;
    message: string;
    receiver: User;
    sender?: User;
    createdAt?: Date;
    

    // userId: string; // Remitente
    // username: string; // Remitente
    // socketId: string; // socketId del receptor
    // message: string; // mensaje
}