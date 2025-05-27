import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Injectable()
export class AttachUserInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const client = context.switchToWs().getClient() as any;

    const token = client.token ?? client.handshake.auth.token;

    if (token) {
      try {
        if (!client.userId || !client.userName) {
          const user = await this.authService.verifyToken(token);
          client.userId = user.sub;
          client.userName = await this.authService.getUsername(token);
        }
      } catch (error) {
        client.disconnect();
      }
    }

    return next.handle();
  }
}
