import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private repository: Repository<User>){

    }

    async getAll(): Promise<Array<User>> {
        return await this.repository.find();
    }

    async getById(id: string): Promise<User> {
        return await this.repository.findOne(id);
    }

    async getByUsername(username: string): Promise<User> {
        return await this.repository.findOne({ where: { username: username }});
    }

    async save(user: User): Promise<User> {
        return this.repository.save(user)
    }
}
