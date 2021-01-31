import { UserDTO } from "./user.dto";

export class ResponseFriendDTO extends UserDTO {

    idRequest: string;

    constructor(idRequest: string, idRequester: string, username: string, isOnline: boolean, idSocket: string) {
        
        super(idRequester, username, isOnline, idSocket);
        this.idRequest = idRequest;
    }
}