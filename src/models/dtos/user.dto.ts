
export class UserDTO {

    id: string;
    username: string;
    socketId: string;
    isOnline: boolean;

    constructor(id: string, username: string, isOnline?: boolean, socketId?: string) {
        this.id = id;
        this.username = username;
        this.isOnline = isOnline;
        this.socketId = socketId;
    }
}