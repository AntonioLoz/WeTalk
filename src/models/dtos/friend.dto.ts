export class FriendDTO {
    
    id: string;
    username: string;
    socketId: string;

    constructor( id: string, username: string) {
        this.id = id;
        this.username = username;
    }
}