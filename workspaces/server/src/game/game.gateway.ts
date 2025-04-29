import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthService } from '../auth/auth.service';
import { JwtWsGuard } from '../auth/guards/jwt-ws.guard';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: any) {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.authService.verifyToken(token);
      client.user = payload; // Stocker l'utilisateur dans le client
    } catch (err) {
      client.disconnect();
    }

    console.log(`Utilisateur connecté : ${client.id}`);
  }

  async handleDisconnect(client: any) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('create_lobby')
  createLobby(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
  }
}
