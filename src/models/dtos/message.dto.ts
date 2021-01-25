import { User } from "../entities/user.entity";

export class MessageDTO {

    user: User; // Remitente (TODO: Cambiar por UserDTO)
    socketId: string; // socketId del receptor
    message: string; // mensaje
}