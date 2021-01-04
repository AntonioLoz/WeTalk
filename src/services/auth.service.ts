import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/models/jwt.payload';
import { TokenDTO } from 'src/models/token.dto';
import { UserDTO } from 'src/models/user.dto';
import { User } from 'src/models/user.entity';
import { UserService } from './user.service';

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
        const payload = new JwtPayload(user.username);        

        return new TokenDTO(this.jwtService.sign(JSON.parse(payload.toString())));
    }

    async verify(tokenDTO: TokenDTO): Promise<UserDTO> {
        try{
        
            const payload = await this.jwtService.verifyAsync<JwtPayload>(tokenDTO.token);
            return this.userService.getByUsername(payload.username);
        }
        catch(err) {
            throw new Error(err.message)
        }
    }
}
