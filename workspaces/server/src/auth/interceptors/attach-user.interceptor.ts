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

    // Priorité à token mis à jour dans client.token si existant
    const token = client.token ?? client.handshake.auth.token;

    if (token) {
      try {
        // Optionnel : si client.userId & client.userName sont déjà présents, tu peux éviter de refaire l'appel HTTP
        if (!client.userId || !client.userName) {
          const user = await this.authService.verifyToken(token);
          client.userId = user.sub;
          client.userName = await this.authService.getUsername(token);
        }
      } catch (error) {
        // Ici tu peux décider de déconnecter le client si le token n'est pas valide
        client.disconnect();
      }
    }

    return next.handle();
  }
}
