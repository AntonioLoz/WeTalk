import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { FriendDTO } from "src/models/dtos/friend.dto";
import { RequestFriendDTO } from "src/models/dtos/request_friend.dto";
import { FriendshipService } from "src/services/friendship.service";
import { UserService } from "src/services/user.service";
import { CustomSocket } from '../customSocket'

@WebSocketGateway({namespace: '/chat', path: '/chat', transports: ['polling', 'websockets']})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer()
    server: Server;
    clientsConnected: Array<string>;

    constructor(private userService: UserService, private friendService: FriendshipService) {

    }

    // todo: WsResponse para informar al cliente de si conexion exitosa
    async handleConnection(client: CustomSocket, ...args: any[]) {

        try{
            console.log("User connected to chat gateway:");
            console.log("   username: ", client.user.username);
            console.log("   socketId:", client.id);
            
            // lista de las ids de los clientes conectados
            this.clientsConnected = Object.keys(this.server.clients().sockets);
        }
        catch(err) {
            console.error(err);  
        }
    }

    async handleDisconnect(client: CustomSocket) {

        try {
    
            this.userService.updateUserConnection(client.user.id, false, null);
            console.log("User disconnected:");
            console.log("   username: ", client.user.username);
            console.log("   socketId:", client.id);
        }
        catch(error) {
            console.error(error);
        }
        
        
        this.clientsConnected = Object.keys(this.server.clients().sockets);
    }

    @SubscribeMessage('friend_request')
    async addFriendRequest(@ConnectedSocket() client: CustomSocket, @MessageBody() friendId: string): Promise<WsResponse<any>> {
        let wsResponse: WsResponse
        try {
            
            const friendRequested = await this.friendService.newRequest(new RequestFriendDTO(client.user.id, friendId));
            const friend = await this.userService.getById(friendId);
            
            if(friend.isOnline){

                this.server.emit('friend_request', friend).to(friend.socketId);
            }
            
            wsResponse = { event: 'friend_request_resolution', data: friendRequested }

        } catch (error) {
            console.error(error);
            wsResponse = { event: 'friend_request_resolution', data: error }
        }
        
        return wsResponse;
    }

    // todo: completar wsResponse
    @SubscribeMessage('accept_friendship')
    async acceptedFriend(@ConnectedSocket() client: CustomSocket, @MessageBody() idRequest: string): Promise<WsResponse<FriendDTO>> {
        let wsResponse: WsResponse;
        try {
            await this.friendService.acceptFriendRequest(idRequest, client.user.id);
            
            wsResponse = { event: '', data: ''}
        } catch (error) {
            console.error(error);
            wsResponse = { event: '', data: ''}
        }

        return wsResponse;
    } 
}