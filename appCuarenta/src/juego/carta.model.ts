export type Palo = 'corazones' | 'treboles' | 'espadas' | 'diamantes';

export interface Carta {
  valor: number | string;
  palo: string;
}
