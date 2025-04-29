import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    if (!token) return false;

    try {
      const payload = await this.authService.verifyToken(token);
      client.data.user = payload; // stocke l'utilisateur dans le socket
      return true;
    } catch (err) {
      return false;
    }
  }
}
