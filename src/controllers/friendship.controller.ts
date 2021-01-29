import { Controller, Delete, Get, HttpException, HttpStatus, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FriendshipDTO } from 'src/models/dtos/friendship.dto';
import { RequestFriendDTO } from 'src/models/dtos/request_friend.dto';
import { Friendship } from 'src/models/entities/friendship.entity';
import { User } from 'src/models/entities/user.entity';
import { FriendshipService } from 'src/services/friendship.service';

// todo: pasar el mapeo de entidades al servicio correspondiente
@Controller('friendship')
export class FriendshipController {

    constructor(private friendService: FriendshipService) {

    }


    @Post('new')
    @UseGuards(AuthGuard('jwt'))
    async newRequestFriend(@Req() request: Request, @Query('idRequested') idRequested: string): Promise<any> {
       
        const user = <User> request.user;        
        const requestFriend = new RequestFriendDTO(user.id, idRequested);

        try {
           const out = await this.friendService.newRequest(requestFriend);
           return out;
        } catch (error) {
            console.error(error);
            
        }
    }

    // devuelve las peticiones del user id
    @Get('requests')
    @UseGuards(AuthGuard('jwt'))
    async getRequests(@Req() req: Request): Promise<Array<FriendshipDTO>> {
        
        const user = <User>req.user;
        
        try {    
            const requests = await this.friendService.getRequestsByUserId(user.id);
            return requests;
        } catch (error) {

            console.error(error);
            throw new HttpException(error, HttpStatus.NOT_FOUND)
        }
    }

    // devuelve las amistades del usuarid
    @Get('friends')
    @UseGuards(AuthGuard('jwt'))
    async getFriends(@Req() req: Request): Promise<Array<FriendshipDTO>> {
        
        const user = <User> req.user;

        try {    
            const friendships = await this.friendService.getFriendsByUserId(user.id);
            return friendships;

        } catch (error) {

            console.error(error);
            throw new HttpException(error, HttpStatus.NOT_FOUND);
        }
    }

    @Put('accept')
    @UseGuards(AuthGuard('jwt'))
    async acceptRequest(@Req() req: Request, @Query('idRequest') idRequest: string) {
        try {
            const user = <User>req.user
            await this.friendService.acceptFriendRequest(idRequest, user.id);
        } catch (error) {
            console.error(error);
            throw new HttpException(error, HttpStatus.NOT_FOUND);
        }

    }

    @Put('reject')
    @UseGuards(AuthGuard('jwt'))
    async rejectRequest(@Req() req: Request, @Query('idRequest') idRequest: string) {
        
        const user = <User> req.user;
        try {
            this.friendService.rejectRequest(idRequest, user.id);
        } catch (error) {
            console.error(error);            
            throw new HttpException(error, HttpStatus.NOT_FOUND);
        }
    }

    @Delete('delete')
    @UseGuards(AuthGuard('jwt'))
    async deleteFriendship(@Req() req: Request, @Query('idFriendship') idFriendship: string) {

        const user = <User> req.user;
        try {
            this.friendService.deleteFriendship(idFriendship, user.id);
        } catch (error) {
            console.error(error);            
            throw new HttpException(error, HttpStatus.NOT_FOUND);
        }
    }
}
