import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/models/login.dto';
import { TokenDTO } from 'src/models/token.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('login')
export class LoginController {

    constructor(private authService: AuthService) {

    }

    @Post()
    async login(@Body() loginDTO: LoginDTO): Promise<TokenDTO> {

        if(!await this.authService.validateUser(loginDTO.username, loginDTO.password)) {
            throw new UnauthorizedException();
        }

        return await this.authService.generateToken(loginDTO.username);
    }
}
