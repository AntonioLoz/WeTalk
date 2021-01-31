import { PersonalMessage } from "../entities/personal_message.entity";
import { User } from "../entities/user.entity";

export class FriendshipDTO {
    
    id: string;
    sender: User;
    messages: Array<PersonalMessage>;
    registeredAt: Date;
    
    
    constructor(id: string, sender: User, registeredAt: Date, messages: Array<PersonalMessage>) {
        this.id = id;
        this.sender = sender;
        this.registeredAt = registeredAt;
        this.messages = messages;
    }
}