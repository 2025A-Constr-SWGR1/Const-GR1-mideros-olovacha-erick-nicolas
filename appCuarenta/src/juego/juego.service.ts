import { Injectable } from '@nestjs/common';
import { Carta } from './carta.model';
import { Partida } from './partida.model';

@Injectable()
export class JuegoService {
  public partidaActual: Partida;
  private ultimaCartaJugador: Carta | null = null;
  private ultimaCartaMaquina: Carta | null = null;
  private readonly jerarquia: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 'J', 'Q', 'K'];

  private barajarBaraja(): Carta[] {
    const palos = ['corazones', 'treboles', 'diamantes', 'espadas'];
    const valores: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 'J', 'Q', 'K']; // 10 valores por palo

    const baraja: Carta[] = [];

    for (const palo of palos) {
      for (const valor of valores) {
        baraja.push({ valor, palo });
      }
    }

    // Mezclar
    for (let i = baraja.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
    }

    return baraja;
  }

  private detectarRonda(cartas: Carta[]): boolean {
    const conteo: Record<string, number> = {};

    for (const carta of cartas) {
      const clave = String(carta.valor);
      conteo[clave] = (conteo[clave] || 0) + 1;
      if (conteo[clave] === 3) {
        return true;
      }
    }

    return false;
  }

  iniciarPartida(dificultad: 'facil' | 'media' | 'dificil' = 'facil'): Partida {
    const barajada = this.barajarBaraja();

    const jugador = {
      nombre: 'Tú',
      mano: barajada.slice(0, 5),
      puntos: 0,
      esMaquina: false,
    };

    const maquina = {
      nombre: dificultad === 'facil' ? 'El Shunsho' : dificultad === 'media' ? 'El Casual' : 'El Marido',
      mano: barajada.slice(5, 10),
      puntos: 0,
      esMaquina: true,
      dificultad,
    };

    const quienInicia = Math.random() < 0.5 ? 'jugador' : 'maquina';

    this.ultimaCartaJugador = null;
    this.ultimaCartaMaquina = null;

    this.partidaActual = {
      jugador,
      maquina,
      mesa: [],
      historial: [],
      baraja: barajada.slice(10),
      rondasJugadas: 1,
      manoActual: 1,
      quienInicioMano: quienInicia,
      capturadasJugador: [],
      capturadasMaquina: [],
      rondaValorJugador: null,
      rondaValorMaquina: null,
      estado: 'jugando',
      turno: quienInicia,
    };

    if (this.detectarRonda(jugador.mano)) {
      jugador.puntos += 2;
      this.partidaActual.rondaValorJugador = this.valorRonda(jugador.mano);
    }

    if (this.detectarRonda(maquina.mano)) {
      maquina.puntos += 2;
      this.partidaActual.rondaValorMaquina = this.valorRonda(maquina.mano);
    }

    return this.partidaActual;
  }

  private verificarYRepartirNuevaRondaSiEsNecesario(): { mensaje?: string } | null {
    const jugadorSinCartas = this.partidaActual.jugador.mano.length === 0;
    const maquinaSinCartas = this.partidaActual.maquina.mano.length === 0;

    if (jugadorSinCartas && maquinaSinCartas && this.partidaActual.rondasJugadas < 4) {

      this.partidaActual.turno = this.partidaActual.turno === 'jugador' ? 'maquina' : 'jugador';

      this.repartirNuevaRonda();

      return { mensaje: 'Se ha iniciado una nueva ronda automáticamente.' };
    }

    return null;
  }

  private repartirNuevaRonda(): void {
    const p = this.partidaActual!;
    const baraja = p.baraja;

    if (baraja.length < 10) {
      throw new Error('No hay suficientes cartas para repartir una nueva ronda.');
    }

    // Repartir 5 cartas a cada jugador
    p.jugador.mano = baraja.slice(0, 5);
    p.maquina.mano = baraja.slice(5, 10);

    // Actualizar baraja
    p.baraja = baraja.slice(10);

    // Aumentar el contador de rondas
    p.rondasJugadas += 1;

    // Alternar quien inicia la ronda
    //p.turno = p.quienInicioMano === 'jugador' ? 'maquina' : 'jugador';
    p.quienInicioMano = p.turno;

    // Limpiar la mesa e historial
    //p.mesa = [];
    //p.historial = [];

    // Limpiar rondas anteriores
    p.rondaValorJugador = null;
    p.rondaValorMaquina = null;

    // Detectar y aplicar ronda al repartir nuevas cartas
    if (this.detectarRonda(p.jugador.mano)) {
      p.jugador.puntos += 2;
      p.rondaValorJugador = this.valorRonda(p.jugador.mano);
    }

    if (this.detectarRonda(p.maquina.mano)) {
      p.maquina.puntos += 2;
      p.rondaValorMaquina = this.valorRonda(p.maquina.mano);
    }
  }

  capturarCartas(mesa: Carta[], cartaJugada: Carta, mesaEstabaVacia: boolean): { capturadas: Carta[]; limpia: boolean } {
    const capturadas: Carta[] = [];

    const esNumero = typeof cartaJugada.valor === 'number' && cartaJugada.valor >= 1 && cartaJugada.valor <= 7;
    let sumaCaptura: Carta[] = [];

    if (esNumero) {
      for (let i = 0; i < mesa.length; i++) {
        for (let j = i + 1; j < mesa.length; j++) {
          const valorI = mesa[i].valor;
          const valorJ = mesa[j].valor;

          if (
            typeof valorI === 'number' &&
            typeof valorJ === 'number' &&
            typeof cartaJugada.valor === 'number' &&
            valorI + valorJ === cartaJugada.valor
          ) {
            sumaCaptura = [mesa[i], mesa[j]];
            break;
          }
        }
        if (sumaCaptura.length) break;
      }
    }

    const capturaDirecta = mesa.find(c => c.valor === cartaJugada.valor);
    if (capturaDirecta) capturadas.push(capturaDirecta);
    if (sumaCaptura.length) capturadas.push(...sumaCaptura);

    if (capturadas.length > 0) {
      const index = this.jerarquia.findIndex(v => v === cartaJugada.valor);
      for (let i = index + 1; i < this.jerarquia.length; i++) {
        const siguiente = mesa.find(c => c.valor === this.jerarquia[i]);
        if (siguiente) {
          capturadas.push(siguiente);
        } else {
          break;
        }
      }
    }

    const capturadasIds = new Set(capturadas.map(c => `${c.valor}-${c.palo}`));
    const mesaFinal = mesa.filter(c => !capturadasIds.has(`${c.valor}-${c.palo}`));
    const esLimpia = !mesaEstabaVacia && mesaFinal.length === 0;

    return {
      capturadas,
      limpia: esLimpia,
    };
  }

  realizarJugadaJugador(carta: Carta): { estado: Partida; mensaje?: string; resultado?: any } {
    if (!this.partidaActual) {
      throw new Error('No hay partida en curso');
    }

    const { jugador, mesa } = this.partidaActual;
    const indexCarta = jugador.mano.findIndex(c => c.valor === carta.valor && c.palo === carta.palo);
    if (indexCarta === -1) throw new Error('Esa carta no está en tu mano');

    jugador.mano.splice(indexCarta, 1);
    const tipo = this.registrarJugada('jugador', carta);

    const resultado = this.capturarCartas(mesa, carta, mesa.length === 0);
    if (resultado.capturadas.length > 0) {
      const idsCapturadas = new Set(resultado.capturadas.map(c => `${c.valor}-${c.palo}`));
      this.partidaActual.mesa = mesa.filter(c => !idsCapturadas.has(`${c.valor}-${c.palo}`));
    } else {
      this.partidaActual.mesa.push(carta);
    }

    this.partidaActual.historial.push({ turno: 'jugador', carta });

    if (resultado.limpia && jugador.puntos < 38) {
      jugador.puntos += 2;
    }

    if (tipo === 'caida') {
      const valorRonda = this.partidaActual.rondaValorMaquina;
      const esACartaDeRonda = valorRonda && valorRonda === carta.valor;
      if (esACartaDeRonda && jugador.puntos < 38) {
        jugador.puntos += 4;
      } else if (jugador.puntos < 38) {
        jugador.puntos += 2;
      }

      if (this.verificarVictoriaPorCaida(jugador.puntos, 2)) {
        jugador.puntos = 40;
        this.partidaActual.estado = 'finalizada';
        this.partidaActual.ganador = 'jugador';
        return {
          estado: this.partidaActual,
          mensaje: '¡Caída ganadora! El jugador gana la partida.',
          resultado: { ganador: 'jugador', puntos: { jugador: 40, maquina: this.partidaActual.maquina.puntos } }
        };
      }

    }

    const jugadorSinCartas = this.partidaActual.jugador.mano.length === 0;
    const maquinaSinCartas = this.partidaActual.maquina.mano.length === 0;

    if (jugadorSinCartas && maquinaSinCartas && this.partidaActual.rondasJugadas === 4) {
      const resultadoFinal = this.finalizarMano();
      this.partidaActual.estado = 'finalizada';
      return {
        estado: this.partidaActual,
        mensaje: 'Fin de la mano.',
        resultado: resultadoFinal,
      };
    }

    const resultadoReparto = this.verificarYRepartirNuevaRondaSiEsNecesario();
    if (resultadoReparto) {
      return {
        estado: this.partidaActual,
        mensaje: resultadoReparto.mensaje,
      };
    }

    this.partidaActual.turno = 'maquina';

    return { estado: this.partidaActual };
  }

  private decidirCartaMaquina(
    dificultad: 'facil' | 'media' | 'dificil'
  ): Carta {
    const { maquina, mesa, historial } = this.partidaActual!;

    if (dificultad === 'facil') {
      // Siempre lanza la primera carta disponible
      return maquina.mano[0];
    }

    // Generar jugadas posibles
    const posiblesJugadas = maquina.mano.map(carta => {
      const resultado = this.capturarCartas(mesa, carta, mesa.length === 0);
      const puntaje = resultado.limpia
        ? 3
        : resultado.capturadas.length > 0
          ? 1
          : 0;
      return { carta, resultado, puntaje };
    });

    if (dificultad === 'media') {
      // Elegir aleatoriamente entre las mejores o medias jugadas
      const buenas = posiblesJugadas.filter(j => j.puntaje >= 1);
      return (buenas.length ? buenas : posiblesJugadas)[
        Math.floor(Math.random() * (buenas.length || posiblesJugadas.length))
      ].carta;
    }

    // difícil: elegir la jugada con mayor puntaje
    const mejor = posiblesJugadas.reduce((a, b) =>
      b.puntaje > a.puntaje ? b : a
    );
    return mejor.carta;
  }

  public realizarTurnoMaquina(): { estado: Partida; mensaje?: string; resultado?: any } {

    if (!this.partidaActual) {
      throw new Error('No hay partida en curso');
    }

    if (this.partidaActual.turno !== 'maquina') {
      return {
        estado: this.partidaActual,
        mensaje: 'No es turno de la máquina.',
      };
    }

    const carta = this.decidirCartaMaquina(this.partidaActual.maquina.dificultad);
    const maquina = this.partidaActual.maquina;

    // Eliminar carta jugada
    maquina.mano = maquina.mano.filter(
      c => !(c.valor === carta.valor && c.palo === carta.palo)
    );

    const tipo = this.registrarJugada('maquina', carta);
    const resultado = this.capturarCartas(this.partidaActual.mesa, carta, this.partidaActual.mesa.length === 0);

    if (resultado.capturadas.length > 0) {
      const ids = new Set(resultado.capturadas.map(c => `${c.valor}-${c.palo}`));
      this.partidaActual.mesa = this.partidaActual.mesa.filter(c => !ids.has(`${c.valor}-${c.palo}`));
    } else {
      this.partidaActual.mesa.push(carta);
    }

    this.partidaActual.historial.push({ turno: 'maquina', carta });

    // Puntaje
    if (resultado.limpia && maquina.puntos < 38) {
      maquina.puntos += 2;
    }

    if (tipo === 'caida') {
      const valorRonda = this.partidaActual.rondaValorJugador;
      const esACartaDeRonda = valorRonda === carta.valor;

      if (esACartaDeRonda && maquina.puntos < 38) {
        maquina.puntos += 4;
      } else if (maquina.puntos < 38) {
        maquina.puntos += 2;
      }

      if (this.verificarVictoriaPorCaida(maquina.puntos, 2)) {
        maquina.puntos = 40;
        this.partidaActual.estado = 'finalizada';
        this.partidaActual.ganador = 'maquina';
        return {
          estado: this.partidaActual,
          mensaje: '¡Caída ganadora! La máquina gana la partida.',
          resultado: {
            ganador: 'maquina',
            puntos: {
              jugador: this.partidaActual.jugador.puntos,
              maquina: 40
            }
          }
        };
      }
    }

    const jugadorSinCartas = this.partidaActual.jugador.mano.length === 0;
    const maquinaSinCartas = this.partidaActual.maquina.mano.length === 0;

    if (jugadorSinCartas && maquinaSinCartas && this.partidaActual.rondasJugadas === 4) {
      const resultadoFinal = this.finalizarMano();
      this.partidaActual.estado = 'finalizada';
      return {
        estado: this.partidaActual,
        mensaje: 'Fin de la mano.',
        resultado: resultadoFinal,
      };
    }

    const resultadoReparto = this.verificarYRepartirNuevaRondaSiEsNecesario();
    if (resultadoReparto) {
      return {
        estado: this.partidaActual,
        mensaje: resultadoReparto.mensaje,
      };
    }

    // Cambiar turno de vuelta al jugador
    this.partidaActual.turno = 'jugador';

    return {
      estado: this.partidaActual,
    };
  }

  // Metodos para solucionar error de no iniciar una nueva mano 

  private iniciarNuevaMano(): void {
    const p = this.partidaActual!;

    // Limpiar capturas de la mano anterior
    p.capturadasJugador = [];
    p.capturadasMaquina = [];

    // Incrementar el número de la mano si ya había una, o iniciar en 1
    console.log('Valor actual antes de incrementar mano:', p.manoActual);
    p.manoActual = (p.manoActual ?? 0) + 1;
    console.log('Valor después de incrementar mano:', p.manoActual);

    // Restaurar la baraja completa (40 cartas)
    p.baraja = this.barajarBaraja();

    // Repartir las primeras 10 cartas (5 para cada uno)
    p.jugador.mano = p.baraja.slice(0, 5);
    p.maquina.mano = p.baraja.slice(5, 10);
    p.baraja = p.baraja.slice(10);

    // Reiniciar otras propiedades de estado
    p.mesa = [];
    p.historial = [];
    p.rondasJugadas = 1;
    p.rondaValorJugador = null;
    p.rondaValorMaquina = null;

    // Alternar quién inicia
    p.quienInicioMano = p.quienInicioMano === 'jugador' ? 'maquina' : 'jugador';
    p.turno = p.quienInicioMano;

    // Verificar ronda para ambos jugadores
    if (this.detectarRonda(p.jugador.mano)) {
      p.jugador.puntos += 2;
      p.rondaValorJugador = this.valorRonda(p.jugador.mano);
    }

    if (this.detectarRonda(p.maquina.mano)) {
      p.maquina.puntos += 2;
      p.rondaValorMaquina = this.valorRonda(p.maquina.mano);
    }
  }


  finalizarMano() {
    const p = this.partidaActual;
    if (!p) {
      throw new Error('No hay partida activa');
    }

    let puntosJugador = 0;
    let puntosMaquina = 0;

    const jugadorPuedeSumar = p.jugador.puntos < 30;
    const maquinaPuedeSumar = p.maquina.puntos < 30;

    if (jugadorPuedeSumar) {
      puntosJugador = this.calcularPuntosPorCaptura(p.capturadasJugador);
    }

    if (maquinaPuedeSumar) {
      puntosMaquina = this.calcularPuntosPorCaptura(p.capturadasMaquina);
    }


    // Victoria especial (si alguna función devuelve 999)
    if (puntosJugador === 999) {
      p.estado = 'finalizada';
      p.ganador = 'jugador';
      return {
        ganador: 'jugador',
        puntos: { jugador: 40, maquina: p.maquina.puntos },
        mensaje: 'Victoria inmediata del jugador por captura especial.',
      };
    }

    if (puntosMaquina === 999) {
      p.estado = 'finalizada';
      p.ganador = 'maquina';
      return {
        ganador: 'maquina',
        puntos: { jugador: p.jugador.puntos, maquina: 40 },
        mensaje: 'Victoria inmediata de la máquina por captura especial.',
      };
    }

    // Asignar puntos normales
    p.jugador.puntos += puntosJugador;
    p.maquina.puntos += puntosMaquina;


    // Verificar victoria por puntos totales
    if (p.jugador.puntos >= 40 || p.maquina.puntos >= 40) {
      const ganador = p.jugador.puntos >= 40 ? 'jugador' : 'maquina';
      const puntos = {
        jugador: p.jugador.puntos,
        maquina: p.maquina.puntos
      };

      p.estado = 'finalizada';

      return {
        ganador,
        puntos,
        mensaje: `¡Victoria por puntos! ${ganador === 'jugador' ? 'El jugador' : 'La máquina'} gana la partida.`
      };
    }

    // Preparar el resumen ANTES de modificar el estado de la partida
    const resumen = {
      puntosOtorgados: {
        jugador: puntosJugador,
        maquina: puntosMaquina
      },
      puntosTotales: {
        jugador: p.jugador.puntos,
        maquina: p.maquina.puntos
      },
      manoAnterior: p.manoActual,
      nuevaMano: p.manoActual + 1, // indicar cuál es la siguiente mano
      mensaje: 'La mano anterior ha finalizado y se ha iniciado una nueva.'
    };

    // Ahora sí, iniciar nueva mano (esto modifica el estado)
    this.iniciarNuevaMano();

    // Devolver el resumen
    return resumen;
  }

  private calcularPuntosPorCaptura(cartas: Carta[]): number {
    const total = cartas.length;
    if (total < 19) return 0;

    const sobrantes = total - 19;
    let conteo = 6 + sobrantes - 1;

    if (conteo >= 14) return 999;
    if (conteo === 13) return 14;

    return conteo % 2 === 0 ? conteo : conteo + 1;
  }

  public valorRonda(cartas: Carta[]): string | number | null {
    const conteo: Record<string, number> = {};
    for (const carta of cartas) {
      const v = String(carta.valor);
      conteo[v] = (conteo[v] || 0) + 1;
      if (conteo[v] === 3) return carta.valor;
    }
    return null;
  }

  public verificarVictoriaPorCaida(puntosAntes: number, puntosGanados: number): boolean {
    return puntosAntes === 38 && puntosGanados === 2;
  }

  private registrarJugada(jugador: 'jugador' | 'maquina', carta: Carta): 'caida' | null {
    if (jugador === 'jugador') {
      if (this.ultimaCartaMaquina?.valor === carta.valor) {
        this.ultimaCartaJugador = carta;
        this.ultimaCartaMaquina = null;
        return 'caida';
      }
      this.ultimaCartaJugador = carta;
    } else {
      if (this.ultimaCartaJugador?.valor === carta.valor) {
        this.ultimaCartaMaquina = carta;
        this.ultimaCartaJugador = null;
        return 'caida';
      }
      this.ultimaCartaMaquina = carta;
    }
    return null;
  }

  public cargarEstado(nuevoEstado: Partida): Partida {
    console.log('Estado recibido en cargarEstado:', nuevoEstado);

    this.partidaActual = {
      ...nuevoEstado,
      estado: typeof nuevoEstado.estado === 'string' ? nuevoEstado.estado : 'jugando'
    };

    return this.partidaActual;
  }

  // Para hacer tests unicamente
  /** public cargarEstado(nuevoEstado: Partida): Partida {
    console.log('Estado recibido en cargarEstado:', nuevoEstado);
    const {
      jugador,
      maquina,
      mesa,
      historial,
      baraja,
      rondasJugadas,
      manoActual,
      quienInicioMano,
      capturadasJugador,
      capturadasMaquina,
      rondaValorJugador,
      rondaValorMaquina,
      turno,
      estado
    } = nuevoEstado;

    this.partidaActual = {
      jugador,
      maquina,
      mesa,
      historial,
      baraja,
      rondasJugadas,
      manoActual: typeof manoActual === 'number' ? manoActual : 1,
      quienInicioMano,
      capturadasJugador,
      capturadasMaquina,
      rondaValorJugador,
      rondaValorMaquina,
      turno,
      estado: typeof estado === 'string' ? estado : 'jugando'
    };

    return this.partidaActual;
  } **/

  public obtenerEstado(): Partida {
    const estadoActual = this.partidaActual;

    return {
      ...estadoActual,
      estado: typeof estadoActual.estado === 'string' ? estadoActual.estado : 'jugando',
      manoActual: typeof estadoActual.manoActual === 'number' ? estadoActual.manoActual : 1,
    };
  }

}
