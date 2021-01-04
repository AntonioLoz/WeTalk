import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { JwtStrategy } from "src/auth/jwt.strategy";
import { CustomSocket } from '../customSocket'

@WebSocketGateway({namespace: 'rooms'})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer()
    server: Server;
    clients: Array<string>;

    constructor(private jwtStrategy: JwtStrategy) {
        this.clients = new Array<string>();
    }

    async handleConnection(client: CustomSocket, ...args: any[]) {


        console.log("User connected:", client.user.username);
        this.clients.push(client.id);
    }

    handleDisconnect(client: CustomSocket) {
        console.log("Client disconnected:", client.id);
        this.clients.splice(this.clients.indexOf(client.id), 1);
        
        // client.server.emit('user-changed', {})
    }

    @SubscribeMessage('createRoom')
    createRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): WsResponse<string> {
        
        
        return { event: 'RoomCreated', data: 'Room'}
    }
}