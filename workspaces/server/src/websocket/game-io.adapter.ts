import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';

export class GameIoAdapter extends IoAdapter {
  private options = {
    cors: {
      origin: process.env.CORS_ALLOW_ORIGIN,
    },
    transports: ['websocket'],
  };

  createIOServer(port: number, options?: ServerOptions): any {
    return super.createIOServer(port, { ...this.options, ...options });
  }
}
