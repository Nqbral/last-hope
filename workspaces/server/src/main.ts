import { AppModule } from '@app/app.module';
import { GameIoAdapter } from '@app/websocket/game-io.adapter';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useWebSocketAdapter(new GameIoAdapter(app));

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
