import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtSocketAdapter } from './websockets/adapters/jwt-socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new JwtSocketAdapter(app));
  app.enableCors();
  await app.listen(3000, () => {
    console.log('************ Server is running on port 3000 ************');
  });
}
bootstrap();
