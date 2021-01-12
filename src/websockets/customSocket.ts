import { Socket } from 'socket.io';
import { UserDTO } from 'src/models/dtos/user.dto';

export interface CustomSocket extends Socket {
    user: UserDTO;
}