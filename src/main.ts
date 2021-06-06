import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO 如果要使用ws模块，就需要使用Adapter
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(8001);
}
bootstrap();
