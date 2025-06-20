import { Test, TestingModule } from '@nestjs/testing';
import { JuegoService } from './juego.service';
import { Carta } from './carta.model';

describe('JuegoService', () => {
  let service: JuegoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JuegoService],
    }).compile();

    service = module.get<JuegoService>(JuegoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería detectar una limpia cuando la mesa queda vacía', () => {
    const mesa: Carta[] = [
      { valor: 2, palo: 'corazones' },
      { valor: 3, palo: 'treboles' }
    ];
    const cartaJugada: Carta = { valor: 5, palo: 'diamantes' };
    const resultado = service.capturarCartas(mesa, cartaJugada, false);

    const valoresCapturados = resultado.capturadas.map(c => c.valor).sort();

    expect(valoresCapturados).toEqual([2, 3]);
    expect(resultado.limpia).toBe(true);
  });

  it('no debería marcar como limpia si la mesa ya estaba vacía al comenzar', () => {
    const mesa: Carta[] = [];
    const cartaJugada: Carta = { valor: 5, palo: 'diamantes' };
    const resultado = service.capturarCartas(mesa, cartaJugada, true);

    expect(resultado.capturadas.length).toBe(0);
    expect(resultado.limpia).toBe(false);
  });

  it('debería detectar ronda si hay tres cartas del mismo valor', () => {
    const mano: Carta[] = [
      { valor: 5, palo: 'corazones' },
      { valor: 5, palo: 'treboles' },
      { valor: 5, palo: 'diamantes' },
      { valor: 3, palo: 'corazones' },
      { valor: 'K', palo: 'treboles' },
    ];
    const resultado = service.valorRonda(mano);
    expect(resultado).toBe(5);
  });

  it('debería retornar null si no hay ronda', () => {
    const mano: Carta[] = [
      { valor: 4, palo: 'corazones' },
      { valor: 5, palo: 'treboles' },
      { valor: 6, palo: 'diamantes' },
      { valor: 3, palo: 'corazones' },
      { valor: 'K', palo: 'treboles' },
    ];
    const resultado = service.valorRonda(mano);
    expect(resultado).toBeNull();
  });

  it('debería retornar true si el jugador tenía 38 y gana con una caída de 2 puntos', () => {
    const puntosAntes = 38;
    const puntosGanados = 2;
    const resultado = service.verificarVictoriaPorCaida(puntosAntes, puntosGanados);
    expect(resultado).toBe(true);
  });

  it('debería retornar false si el jugador tenía menos de 38 puntos', () => {
    const puntosAntes = 36;
    const puntosGanados = 4;
    const resultado = service.verificarVictoriaPorCaida(puntosAntes, puntosGanados);
    expect(resultado).toBe(false);
  });

});