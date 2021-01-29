import { User } from "../entities/user.entity";

export class MessageDTO {

    userId: string; // Remitente
    username: string; // Remitente
    socketId: string; // socketId del receptor
    message: string; // mensaje
}