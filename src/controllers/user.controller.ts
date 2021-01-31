import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RegisterDTO } from 'src/models/dtos/register.dto';
import { UserDTO } from 'src/models/dtos/user.dto';
import { User } from 'src/models/entities/user.entity';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {

    constructor(private service: UserService) {

    }

    @Get('all')
    @UseGuards(AuthGuard('jwt'))
    async getAll(): Promise<Array<UserDTO>> {

        const users  = <Array<UserDTO>> await this.service.getAll();
        
        return users;
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getUser(@Req() req: Request): Promise<UserDTO> {
        
        const requestUser = <User>req.user;
        let user: UserDTO;
        try {
            user = await this.service.getById(requestUser.id);
        } catch (error) {
            console.error(error);
            
        }
            
        return user;
    }

    @Post()
    async create(@Body() registerDTO: RegisterDTO): Promise<User> {

        const user = new User(registerDTO.username, registerDTO.password);

        return this.service.save(user);
    }
}
