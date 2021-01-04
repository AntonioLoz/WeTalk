import { Socket } from 'socket.io';
import { UserDTO } from 'src/models/user.dto';

export interface CustomSocket extends Socket {
    user: UserDTO;
}