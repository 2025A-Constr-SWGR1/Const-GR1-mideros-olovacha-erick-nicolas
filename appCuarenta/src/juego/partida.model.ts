import { Carta } from './carta.model';

export interface Partida {
  jugador: {
    nombre: string;
    mano: Carta[];
    puntos: number;
    esMaquina: boolean;
    dificultad?: 'facil' | 'media' | 'dificil';
  };
  maquina: {
    nombre: string;
    mano: Carta[];
    puntos: number;
    esMaquina: boolean;
    dificultad: 'facil' | 'media' | 'dificil';
  };
  mesa: Carta[];
  historial: { turno: 'jugador' | 'maquina'; carta: Carta }[];
  baraja: Carta[];
  rondasJugadas: number;
  manoActual: number;
  quienInicioMano: 'jugador' | 'maquina';
  capturadasJugador: Carta[];
  capturadasMaquina: Carta[];
  rondaValorJugador: string | number | null;
  rondaValorMaquina: string | number | null;
  estado: 'jugando' | 'finalizada';
  turno: 'jugador' | 'maquina';
  ganador?: 'jugador' | 'maquina';
}
