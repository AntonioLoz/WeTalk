import { User } from "../entities/user.entity";

export class FriendshipDTO {
    
    id: string;
    sender: User;
    registeredAt: Date;
    
    
    constructor(id: string, sender: User, registeredAt: Date) {
        this.id = id;
        this.sender = sender;
        this.registeredAt = registeredAt;
    }
}