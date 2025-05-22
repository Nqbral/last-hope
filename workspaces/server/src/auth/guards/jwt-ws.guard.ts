import { AuthService } from '@app/auth/auth.service';
import { AuthenticatedSocket } from '@app/types/AuthenticatedSocket';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: AuthenticatedSocket = context.switchToWs().getClient();

    if (client.userId) return true;

    const token = client.handshake.auth?.token;
    if (!token) return false;

    try {
      const payload = await this.authService.verifyToken(token);
      client.userId = payload.sub; // stocke l'utilisateur dans le socket

      return true;
    } catch (err) {
      return false;
    }
  }
}
