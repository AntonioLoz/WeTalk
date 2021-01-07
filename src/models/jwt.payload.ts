export class JwtPayload {
    id: string;
    username: string;

    constructor(id: string, username: string) {
        this.username = username;
        this.id = id;
    }

    toString(): string {
        return `{"username":"${this.username}", "id":"${this.id}"}`
    }
}