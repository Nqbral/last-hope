import { AppController } from '@app/app.controller';
import { GameModule } from '@app/game/game.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GameModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
