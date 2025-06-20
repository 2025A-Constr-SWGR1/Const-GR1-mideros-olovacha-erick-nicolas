import { Test, TestingModule } from '@nestjs/testing';
import { JuegoController } from './juego.controller';
import { JuegoService } from './juego.service';

describe('JuegoController', () => {
  let controller: JuegoController;
  let service: JuegoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JuegoController],
      providers: [JuegoService],
    }).compile();

    controller = module.get<JuegoController>(JuegoController);
    service = module.get<JuegoService>(JuegoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debería iniciar una nueva partida', () => {
    const partida = controller.iniciarPartida('facil');
    expect(partida).toHaveProperty('jugador');
    expect(partida).toHaveProperty('maquina');
    expect(partida.jugador.mano.length).toBe(5);
    expect(partida.maquina.mano.length).toBe(5);
  });

  it('debería devolver el estado actual de la partida', () => {
    controller.iniciarPartida('media');
    const estado = controller.estadoPartida();
    expect(estado).toHaveProperty('jugador');
    expect(estado).toHaveProperty('maquina');
  });
});