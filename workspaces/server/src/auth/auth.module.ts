import { AuthService } from '@app/auth/auth.service';
import { JwtWsGuard } from '@app/auth/guards/jwt-ws.guard';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtWsGuard],
  exports: [AuthService, JwtWsGuard], // <-- Important
  imports: [
    HttpModule,
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
