import { User } from "../entities/user.entity";

export class RequestFriendDTO {
    
    senderId: string;
    receiverId: string;

    constructor(senderId: string, receiverId: string) {
        this.senderId = senderId;
        this.receiverId = receiverId;
    }
}