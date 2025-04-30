import { AppController } from '@app/app.controller';
import { GameModule } from '@app/game/game.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Rendre les variables d'env accessibles partout
    }),
    GameModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
