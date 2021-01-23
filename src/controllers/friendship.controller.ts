import { Controller, Delete, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FriendDTO } from 'src/models/dtos/friend.dto';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { ResponseFriendDTO } from 'src/models/dtos/response_friend.dto';
import { Friendship } from 'src/models/entities/friend.entity';
import { FriendRequest } from 'src/models/entities/friend_request.entity';
import { User } from 'src/models/entities/user.entity';
import { FriendshipService } from 'src/services/friend.service';
import { DeleteResult } from 'typeorm';

// todo: pasar el mapeo de entidades al servicio correspondiente
@Controller('friendship')
export class FriendshipController {

    constructor(private friendService: FriendshipService) {

    }


    @Post('new')
    @UseGuards(AuthGuard('jwt'))
    async newRequestFriend(@Req() request: Request, @Query('idRequested') idRequested: string): Promise<any> {
        const user = <User> request.user;
        console.log('idRequested: ', idRequested);
        
        const requestFriend = new RequestFriendDTO(user.id, idRequested);
        let out: FriendRequest;

        try {
            out = await this.friendService.newRequest(requestFriend);
        } catch (error) {
            console.error(error);
            
        }

        return out;
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
    async getFriends(@Req() req: Request): Promise<Array<FriendDTO>> {
        let friends = Array<FriendDTO>();
        const user = <User> req.user;

        try {    
            const friendships = await this.friendService.getFriendsByUserId(user.id);
            for(const friendship of friendships) {
                friends.push(new FriendDTO(friendship.id, friendship.friend.id, friendship.friend.username, friendship.friend.isOnline, friendship.friend.socketId));
            }

        } catch (error) {

            console.error(error);
            throw new HttpException(error, HttpStatus.NOT_FOUND);
        }

        return friends;
    }

    @Post('accept')
    @UseGuards(AuthGuard('jwt'))
    async acceptRequest(@Query('idRequest') idRequest: string): Promise<Friendship> {
        
        let friendship: Friendship;

        try {
            
            friendship = await this.friendService.acceptFriendRequest(idRequest);
        } catch (error) {
            console.error(error);
            throw new HttpException(error, HttpStatus.NOT_FOUND);
        }

        return friendship;
    }

    @Delete('reject')
    @UseGuards(AuthGuard('jwt'))
    async rejectRequest(@Query('idRequest') idRequest: string): Promise<DeleteResult> {
        return this.friendService.rejectRequest(idRequest);
    }

    @Delete('delete')
    @UseGuards(AuthGuard('jwt'))
    async deleteFriendship(@Query('idFriendship') idFriendship: string) {
        return this.friendService.deleteFriendship(idFriendship);
    }
}
