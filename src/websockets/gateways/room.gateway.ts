import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { JwtStrategy } from "src/auth/jwt.strategy";
import { CustomSocket } from '../customSocket'

@WebSocketGateway({namespace: 'rooms'})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer()
    server: Server;
    clientsConnected: Array<string>;

    constructor() {

    }

    async handleConnection(client: CustomSocket, ...args: any[]) {


        console.log("User connected:", client.user.username);

        // lista de las ids de los clientes conectados
        this.clientsConnected = Object.keys(this.server.clients().sockets);

    }

    handleDisconnect(client: CustomSocket) {

        console.log("Client disconnected:", client.id);
        this.clientsConnected = Object.keys(this.server.clients().sockets);
    }

    @SubscribeMessage('createRoom')
    createRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): WsResponse<string> {
        
        
        return { event: 'RoomCreated', data: 'Room'}
    }
}