import { Module } from '@nestjs/common';
import { RoomGateway } from '../gateways/room.gateway'

@Module({
    providers: [RoomGateway]
})
export class SocketsModule {}
