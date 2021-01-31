import { Socket } from 'socket.io';
import { User } from 'src/models/entities/user.entity';

export interface CustomSocket extends Socket {
    user: User;
}