import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendDTO } from 'src/models/dtos/friend.dto';
import { FriendshipService } from 'src/services/friend.service';

@Controller('friendship')
export class FriendshipController {

    constructor(private friendService: FriendshipService) {

    }

    // devuelve las peticiones del user id
    @Get('/requests')
    @UseGuards(AuthGuard('jwt'))
    async getRequests(@Query('id') id: string): Promise<Array<FriendDTO>> {
        let requests: Array<FriendDTO>;

        try {    
            requests = await this.friendService.getRequests(id);

        } catch (error) {
            console.error(error);

            throw new HttpException(error, HttpStatus.NOT_FOUND)
            
        }

        return requests;
    }

    // devuelve las amistades del usuarid
    @Get('friends')
    @UseGuards(AuthGuard('jwt'))
    async getFriends(@Query('id') id: string) {
        let friends: Array<FriendDTO>;

        try {    
            friends = await this.friendService.getAllFriends(id);

        } catch (error) {
            console.error(error);

            throw new HttpException(error, HttpStatus.NOT_FOUND)
            
        }

        return friends;
    }
}
