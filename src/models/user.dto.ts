import { Room } from "./room.entity";

export class UserDTO {
    id: string;
    username: string;
    socketId: string
    room: Room;
}