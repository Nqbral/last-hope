import { AppController } from '@app/src/app.controller';
import { AppService } from '@app/src/app.service';
import { GameModule } from '@app/src/game/game.module';
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
  providers: [AppService],
})
export class AppModule {}
