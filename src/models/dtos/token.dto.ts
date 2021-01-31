import { User } from "../entities/user.entity";

export class TokenDTO {
    token: string;
    user: User;
    
    constructor(token: string, user?: User) {
        this.token = token;
        this.user = user;
    }
}