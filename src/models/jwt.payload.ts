export class JwtPayload {
    username: string;

    constructor(username: string) {
        this.username = username;
    }

    toString(): string {
        return `{"username":"${this.username}"}`
    }
}