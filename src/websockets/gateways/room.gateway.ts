import { UnauthorizedException, UseFilters } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { UnauthorizedErrorFilter } from "src/filters/unauthorized-error.filter";
import { UserService } from "src/services/user.service";
import { CustomSocket } from '../customSocket'

@WebSocketGateway({namespace: '/rooms', path: '/rooms'})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer()
    server: Server;
    clientsConnected: Array<string>;

    constructor(private userService: UserService) {

    }

    // todo: WsResponse para informar al cliente de si conexion exitosa
    async handleConnection(client: CustomSocket, ...args: any[]) {

        try{
            console.log("User connected:");
            console.log("   username: ", client.user.username);
            console.log("   socketId:", client.id);
            
            // lista de las ids de los clientes conectados
            this.clientsConnected = Object.keys(this.server.clients().sockets);   
        }
        catch(err) {
            console.log(err);
            
            throw new UnauthorizedException(err, err.message);
        }
    }

    async handleDisconnect(client: CustomSocket) {

        console.log("User disconnected:");
        console.log("   username: ", client.user.username);
        console.log("   socketId:", client.id);
        
        
        // todo: Actualizar el usuario a desconectado y borrar el socketid
        this.userService.setUserConnection(client.user.id, false, null);
        this.clientsConnected = Object.keys(this.server.clients().sockets);
    }

    @SubscribeMessage('createRoom')
    createRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): WsResponse<string> {
        
        
        return { event: 'RoomCreated', data: 'Room'};
    }
}