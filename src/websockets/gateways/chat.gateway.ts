import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { FriendshipDTO } from "src/models/dtos/friendship.dto";
import { FriendConnectionUpdateDTO } from "src/models/dtos/friend_update.dto";
import { MessageDTO } from "src/models/dtos/message.dto";
import { FriendshipService } from "src/services/friendship.service";
import { UserService } from "src/services/user.service";
import { CustomSocket } from '../customSocket'

@WebSocketGateway({namespace: '/chat', path: '/chat', transports: ['polling', 'websockets']})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer()
    private server: Server;

    constructor(private userService: UserService, private friendService: FriendshipService,) {

    }

    // todo: WsResponse para informar al cliente del resultado de la conexión
    async handleConnection(client: CustomSocket, ...args: any[]) {

        try{
            await this.userService.updateUserConnection(client.user.id, true, client.id);
            client.user.isOnline = true;
            client.user.socketId = client.id;
            console.log("User connected to chat gateway:");
            console.log("   username: ", client.user.username);
            console.log("   socketId:", client.id);
            const friends = await this.friendService.getFriendsConnected(client.user.id);            
            this.sendFriendConnectionUpdate(friends, client.id, true);
            // lista de las ids de los clientes conectados
            // this.clientsConnected = Object.keys(this.server.clients().sockets);
        }
        catch(err) {
            console.error(err);  
        }
    }

    async handleDisconnect(client: CustomSocket) {

        try {
            this.userService.updateUserConnection(client.user.id, false, "");
            console.log("User disconnected:");
            console.log("   username: ", client.user.username);
            console.log("   socketId:", client.id);
            const friends = await this.friendService.getFriendsConnected(client.user.id);
            this.sendFriendConnectionUpdate(friends, client.id, false);
        }
        catch(error) {
            console.error(error);
        }
        
        
        // this.clientsConnected = Object.keys(this.server.clients().sockets);
    }

    @SubscribeMessage('message')
    async sendMessageTo(@ConnectedSocket() client: CustomSocket, @MessageBody() message: MessageDTO) {
        try {
            message.sender = client.user;
            
            this.friendService.createMessage(message);
            this.server.to(message.receiver.socketId).emit('message', message);
        } catch (error) {
            console.log(error);
        }
        
    }

    private async sendFriendConnectionUpdate(friendships: Array<FriendshipDTO>, socketId: string, isConnected: boolean) {
        for(const friendship of friendships) {
            
            this.server.to(friendship.sender.socketId).emit('friend_connection_update', new FriendConnectionUpdateDTO(friendship.id, isConnected, socketId))
        }
    }
}
    
    // @SubscribeMessage('friend_request')
    // async addFriendRequest(@ConnectedSocket() client: CustomSocket, @MessageBody() friendId: string): Promise<WsResponse<any>> {
    //     let wsResponse: WsResponse
    //     try {
            
    //         const friendRequested = await this.friendService.newRequest(new RequestFriendDTO(client.user.id, friendId));
    //         const friend = await this.userService.getById(friendId);
            
    //         if(friend.isOnline && friend.socketId){

    //             this.server.to(friend.socketId).emit('friend_request', friend);
    //         }
            
    //         // todo: revisar response
    //         wsResponse = { event: 'friend_request_resolution', data: friendRequested }

    //     } catch (error) {
    //         console.error(error);
    //         wsResponse = { event: 'friend_request_resolution', data: error }
    //     }
        
    //     return wsResponse;
    // }

    // todo: completar wsResponse
    // @SubscribeMessage('accept_friendship')
    // async acceptedFriend(@ConnectedSocket() client: CustomSocket, @MessageBody() idRequest: string): Promise<WsResponse<FriendDTO>> {
    //     let wsResponse: WsResponse;
    //     try {
    //         await this.friendService.acceptFriendRequest(idRequest, client.user.id);
            
    //         wsResponse = { event: '', data: ''};
    //     } catch (error) {
    //         console.error(error);
    //         wsResponse = { event: '', data: ''};
    //     }

    //     return wsResponse;
    // } 


