import { use } from "passport";
import { Room } from "../entities/room.entity";

export class UserDTO {

    id: string;
    username: string;
    socketId: string

    constructor(id: string, username: string, socketId?: string) {
        this.id = id;
        this.username = username;
        
        if(socketId){
            this.socketId = socketId;
        }
    }
}