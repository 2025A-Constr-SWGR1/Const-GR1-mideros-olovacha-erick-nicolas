import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JuegoController } from './juego/juego.controller';
import { JuegoService } from './juego/juego.service';

@Module({
  imports: [],
  controllers: [AppController, JuegoController],
  providers: [AppService, JuegoService],
})
export class AppModule {}
