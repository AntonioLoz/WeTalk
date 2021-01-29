import { from } from "rxjs";
import { FriendConnectionStatus } from '../enums/connection_status'
 
export class FriendConnectionUpdateDTO {
    friendshipId: string; 
    isConnected: boolean;
    socketId: string;

    constructor(friendshipId: string, isConnected: boolean, socketId: string) {
        this.friendshipId = friendshipId;
        this.isConnected = isConnected;
        this.socketId = socketId
    }
}