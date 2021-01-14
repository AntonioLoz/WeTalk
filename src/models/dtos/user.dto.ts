import { Friendship } from "../entities/friend.entity";
import { FriendRequest } from "../entities/friend_request.entity";
// import { FriendRequest } from "../entities/friend_request.entity";

export class UserDTO {

    id: string;
    username: string;
    socketId: string;
    isOnline: boolean
    friends: Array<Friendship>;
    friendRequests: Array<FriendRequest>

    constructor(id: string, username: string, socketId?: string) {
        this.id = id;
        this.username = username;
        
        if(socketId){
            this.socketId = socketId;
        }
    }
}