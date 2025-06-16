import { Carta } from './carta.model';

export interface Jugador {
  nombre: string;
  mano: Carta[];
  puntos: number;
  esMaquina: boolean;
  dificultad?: 'facil' | 'media' | 'dificil'; // Solo para IA
}
