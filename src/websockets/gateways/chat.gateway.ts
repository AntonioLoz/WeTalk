import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server } from 'socket.io'
import { UserService } from "src/services/user.service";
import { CustomSocket } from '../customSocket'

@WebSocketGateway({namespace: '/rooms', path: '/rooms', transports: ['polling', 'websockets']})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {


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
        }
    }

    async handleDisconnect(client: CustomSocket) {

        try {
            // todo: Actualizar el usuario a desconectado y borrar el socketid
            this.userService.setUserConnection(client.user.id, false, null);
            console.log("User disconnected:");
            console.log("   username: ", client.user.username);
            console.log("   socketId:", client.id);
        }
        catch(error) {
            console.log(error);
            
        }
        
        
        this.clientsConnected = Object.keys(this.server.clients().sockets);
    }

    @SubscribeMessage('add_friend')
    createRoom(@ConnectedSocket() client: CustomSocket, @MessageBody() room: string): WsResponse<string> {
        
        console.log("User: ", client.user);
        
        
        return { event: 'RoomCreated', data: 'Room'};
    }
}