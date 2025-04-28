import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, { socketId: string }> = new Map();

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token as string | undefined;

    if (token && this.clients.has(token)) {
      const client = this.clients.get(token);

      if (client) {
        client.socketId = socket.id;
      }

      return;
    }

    const newToken = uuidv4();

    this.clients.set(newToken, { socketId: socket.id });
    socket.emit('assign_token', { token: newToken });
  }

  async handleDisconnect(socket: Socket) {}
}
