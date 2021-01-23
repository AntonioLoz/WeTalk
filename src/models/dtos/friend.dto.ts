import { UserDTO } from "./user.dto";

export class FriendDTO extends UserDTO {
    
    idFriendship: string;
    
    constructor(idFriendship: string, idRequester: string, username: string, isOnline?: boolean, sockeId?: string) {
        
        super(idRequester, username, isOnline, sockeId);
        this.idFriendship = idFriendship;
    }
}