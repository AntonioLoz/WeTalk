import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/models/jwt.payload';
import { TokenDTO } from 'src/models/dtos/token.dto';
import { UserDTO } from 'src/models/dtos/user.dto';
import { UserService } from './user.service';
import { User } from 'src/models/entities/user.entity';

@Injectable()
export class AuthService {

    constructor( private userService: UserService, private jwtService: JwtService) {

    }

    async validateUser(username: string, password: string): Promise<boolean> {
        const user = await this.userService.getByUsername(username);
        return await user.validatePassword(password);
    }

    async generateToken(username: string): Promise<TokenDTO> {
        const user = await this.userService.getByUsername(username);
        const payload = new JwtPayload(user.id, user.username);        

        return new TokenDTO(this.jwtService.sign(JSON.parse(payload.toString())));
    }

    async verify(tokenDTO: TokenDTO): Promise<User> {
        
        const payload = await this.jwtService.verifyAsync<JwtPayload>(tokenDTO.token);
        return await this.userService.getByUsername(payload.username);
    }
}
