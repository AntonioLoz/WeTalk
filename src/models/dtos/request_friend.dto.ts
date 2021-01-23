export class RequestFriendDTO {
    idUser: string;
    idRequested: string;

    constructor(idUser: string, idRequested: string) {
        this.idUser = idUser;
        this.idRequested = idRequested;
    }
}