import { Controller, Post, Body, Get } from '@nestjs/common';
import { JuegoService } from './juego.service';
import { Carta } from './carta.model';
import { Partida } from './partida.model';

@Controller('juego')
export class JuegoController {
  constructor(private readonly juegoService: JuegoService) { }

  @Post('iniciar')
  iniciarPartida(@Body('dificultad') dificultad: 'facil' | 'media' | 'dificil') {
    return this.juegoService.iniciarPartida(dificultad);
  }

  @Get('estado')
  estadoPartida() {
    return this.juegoService.obtenerEstado();
  }

  @Post('capturar')
  capturarCartas(@Body() data: { mesa: Carta[]; carta: Carta }) {
    return this.juegoService.capturarCartas(
      data.mesa,
      data.carta,
      data.mesa.length === 0,
    );
  }

  @Post('jugar')
  jugar(@Body() data: { carta: Carta }) {
    return this.juegoService.realizarJugadaJugador(data.carta);
  }

  @Post('turno-maquina')
  turnoMaquina() {
    return this.juegoService.realizarTurnoMaquina();
  }

  @Post('finalizar-mano')
  finalizarMano() {
    return this.juegoService.finalizarMano();
  }

  // Para hacer tests unicamente
  @Post('cargar-estado')
  public cargarEstado(@Body() estado: Partida): Partida {
    return this.juegoService.cargarEstado(estado);
  }
}

