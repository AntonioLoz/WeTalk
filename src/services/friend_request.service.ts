// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UserDTO } from 'src/models/dtos/user.dto';
// import { Friend } from 'src/models/entities/friend.entity';
// import { FriendRequest } from 'src/models/entities/friend_request.entity';
// import { User } from 'src/models/entities/user.entity';
// import { DeleteResult, Repository } from 'typeorm';
// import { UserService } from './user.service';

// @Injectable()
// export class FriendRequestService {

//     constructor(@InjectRepository(FriendRequest) private repository: Repository<FriendRequest>, private userService: UserService) {

//     }

//     async set(user: UserDTO, requester: UserDTO): Promise<FriendRequest> {

//         if(!user) throw new NotFoundException("User not found with id:" + user.id);
//         if(!requester) throw new NotFoundException("Requester not found with id:" + requester.id);

//         const friendRequest = new FriendRequest(user, requester);

//         return this.repository.save(friendRequest);
//     }

//     async get(userId: string): Promise<Array<Friend>> {

//         const user = await this.userService.getById(userId);
//         if(!user) throw new NotFoundException("User not found with id:" + userId);

//         return user.friends;
//     }

//     async delete(userId: string): Promise<DeleteResult> {

//         const user = await this.userService.getById(userId);
//         if(!user) throw new NotFoundException("User not found with id:" + userId);

        
//         return this.repository.delete(userId);
//     }
// }