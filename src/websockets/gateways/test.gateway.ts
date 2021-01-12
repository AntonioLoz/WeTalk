import { UnauthorizedException, UseFilters } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { UnauthorizedErrorFilter } from "src/filters/unauthorized-error.filter";
import { CustomSocket } from '../customSocket'

@WebSocketGateway({namespace: '/test', path: '/test'})
export class TestGateway implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer()
    server: Server;
    clientsConnected: Array<string>;

    constructor() {

    }

    @UseFilters(UnauthorizedErrorFilter)
    handleConnection(client: CustomSocket, ...args: any[]) {

        try{
            console.log("User connect to test:");
            console.log("   username: ", client.user.username);
            console.log("   socketId:", client.id);
            
            // lista de las ids de los clientes conectados
            this.clientsConnected = Object.keys(this.server.clients().sockets);   
        }
        catch(err) {
            console.log("ERRORRRRR");
            
            throw new UnauthorizedException(err, err.message);
        }
    }

    handleDisconnect(client: CustomSocket) {

        console.log("User connected:");
            console.log("   username: ", client.user.username);
            console.log("   socketId:", client.id);
        this.clientsConnected = Object.keys(this.server.clients().sockets);
    }

    @SubscribeMessage('createRoom')
    createRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): WsResponse<string> {
        
        
        return { event: 'RoomCreated', data: 'Room'}
    }
}