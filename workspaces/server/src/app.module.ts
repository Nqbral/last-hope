import { AppController } from '@app/src/app.controller';
import { AppService } from '@app/src/app.service';
import { GameModule } from '@app/src/game/game.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
