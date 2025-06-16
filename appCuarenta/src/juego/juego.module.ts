import { Module } from '@nestjs/common';
import { JuegoService } from './juego.service';
import { JuegoController } from './juego.controller';

@Module({
  providers: [JuegoService],
  controllers: [JuegoController],
})
export class JuegoModule {}
