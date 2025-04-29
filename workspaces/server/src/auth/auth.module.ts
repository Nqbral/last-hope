import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { JwtWsGuard } from './guards/jwt-ws.guard';

@Module({
  providers: [AuthService, JwtWsGuard],
  exports: [AuthService, JwtWsGuard], // <-- Important
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // Si tu utilises ConfigModule pour charger .env
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Récupérer la clé depuis l'env
        signOptions: { expiresIn: '1h' }, // Le temps d'expiration du JWT
      }),
    }),
  ],
})
export class AuthModule {}
