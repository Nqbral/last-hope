import { AppController } from '@app/src/app.controller';
import { AppService } from '@app/src/app.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
