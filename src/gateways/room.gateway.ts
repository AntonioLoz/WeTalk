import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

@WebSocketGateway(80, {namespace: 'rooms'})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {


    @WebSocketServer()
    server: Server;
    clients: Array<string>;

    constructor() {
        this.clients = new Array<string>();
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log("Client connected: ",client.id);
        this.clients.push(client.id);
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected:", client.id);
        this.clients.splice(this.clients.indexOf(client.id), 1);
    }

    @SubscribeMessage('createRoom')
    createRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): WsResponse<string> {
        
        
        return { event: 'RoomCreated', data: 'Room'}
    }
}