import { Friend } from "../entities/friend.entity";

export class UserDTO {

    id: string;
    username: string;
    socketId: string;
    isOnline: boolean
    friends: Array<Friend>;
    // friends: Array<Friendship>;

    constructor(id: string, username: string, socketId?: string) {
        this.id = id;
        this.username = username;
        
        if(socketId){
            this.socketId = socketId;
        }
    }
}