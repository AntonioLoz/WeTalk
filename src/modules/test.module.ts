import { Module } from '@nestjs/common';
import { TestGateway } from '../websockets/gateways/test.gateway'

@Module({
    providers: [
        TestGateway
    ]
})
export class TestModule {}
