import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    if (!token) {
      throw new WsException('Token manquant');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      client.user = payload; // Attache l'utilisateur à la socket
      return true;
    } catch (err) {
      throw new WsException('Token invalide');
    }
  }
}
