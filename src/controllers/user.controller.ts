import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDTO } from 'src/models/register.dto';
import { User } from 'src/models/user.entity';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {

    constructor(private service: UserService) {

    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAll(): Promise<Array<User>> {
        return this.service.getAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async getUserById(@Param('id') id: string): Promise<User> {
        return await this.service.getById(id);
    }

    @Post()
    async create(@Body() registerDTO: RegisterDTO): Promise<User> {

        const user = new User(registerDTO.username, registerDTO.password);

        return this.service.save(user);
    }
}
