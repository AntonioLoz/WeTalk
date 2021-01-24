import { User } from "../entities/user.entity";

export class RequestFriendDTO {
    
    idUser1: string;
    idUser2: string;

    constructor(idUser1: string, idUser2: string) {
        this.idUser1 = idUser1;
        this.idUser2 = idUser2;
    }
}