import { Controller, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FriendDTO } from 'src/models/dtos/friend.dto';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { ResponseFriendDTO } from 'src/models/dtos/response_friend.dto';
import { FriendRequest } from 'src/models/entities/friend_request.entity';
import { User } from 'src/models/entities/user.entity';
import { FriendshipService } from 'src/services/friend.service';

// todo: pasar el mapeo de entidades al servicio correspondiente
@Controller('friendship')
export class FriendshipController {

    constructor(private friendService: FriendshipService) {

    }


    @Post()
    @UseGuards(AuthGuard('jwt'))
    async newRequestFriend(@Req() request: Request, @Query('idRequested') idRequested: string): Promise<any> {
        const user = <User> request.user;
        const requestFriend = new RequestFriendDTO(user.id, idRequested);

        try {
            this.friendService.newRequest(requestFriend);
        } catch (error) {
            console.error(error);
            
        }

        return ;
    }

    // devuelve las peticiones del user id
    @Get('requests')
    @UseGuards(AuthGuard('jwt'))
    async getRequests(@Req() req: Request): Promise<Array<ResponseFriendDTO>> {
        
        let requestFriend = Array<ResponseFriendDTO>();
        const user = <User>req.user;
        try {    
            const requests = await this.friendService.getRequestsByUserId(user.id);

            for(const request of requests) {
                requestFriend.push(new ResponseFriendDTO(request.id, request.user.id, request.user.username, request.user.isOnline, request.user.socketId));
            }

        } catch (error) {

            console.error(error);
            throw new HttpException(error, HttpStatus.NOT_FOUND)
        }

        return requestFriend;
    }

    // devuelve las amistades del usuarid
    @Get('friends')
    @UseGuards(AuthGuard('jwt'))
    async getFriends(@Query('id') id: string) {
        let friends = Array<FriendDTO>();

        try {    
            const friendships = await this.friendService.getFriendsByUserId(id);
            for(const friendship of friendships) {
                friends.push(new FriendDTO(friendship.id, friendship.friend.id, friendship.friend.username, friendship.friend.isOnline, friendship.friend.socketId));
            }

        } catch (error) {
            console.error(error);

            throw new HttpException(error, HttpStatus.NOT_FOUND)
            
        }

        return friends;
    }
}
