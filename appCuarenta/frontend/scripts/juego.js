// ***************************************************
// ***** PARA RECUPERAR EL NOMBRE Y LA DIFICULTAD DE index.html *********
// Paso 1: Leer parámetros de la URL o sessionStorage
const params = new URLSearchParams(window.location.search);
let nombreJugador = params.get('nombre');
let dificultad = params.get('dificultad');
let partidaFinalizada = false;

// Si están en la URL, guardarlos en sessionStorage
if (nombreJugador && dificultad) {
  sessionStorage.setItem('nombre', nombreJugador);
  sessionStorage.setItem('dificultad', dificultad);
} else {
  // Si no están, intentar recuperarlos del sessionStorage
  nombreJugador = sessionStorage.getItem('nombre') || 'Jugador';
  dificultad = sessionStorage.getItem('dificultad') || 'facil';
}

// Función para obtener el nombre personalizado de la máquina
function obtenerNombreMaquina(dificultad) {
  switch (dificultad) {
    case 'facil': return 'El Shunsho';
    case 'media': return 'El Casual';
    case 'dificil': return 'El Marido';
    default: return 'La Máquina';
  }
}

// Mostrar nombres en pantalla
document.getElementById('nombre-jugador').innerText = `Jugador: ${nombreJugador}`;
document.getElementById('nombre-maquina').innerText = `Máquina: ${obtenerNombreMaquina(dificultad)}`;

//*************************************
// LLAMADA AL BACKEND PARA INICIAR LA PARTIDA (todavía sin renderizar las cartas)
let ultimaPartida = null; // Aquí guardaremos el estado de la partida

// Mostrar un mensaje en pantalla
function mostrarMensaje(texto) {
  const mensajeDiv = document.getElementById('mensaje');
  if (mensajeDiv) {
    mensajeDiv.innerText = texto;
  }
}

// Mostrar de quién es el turno
function mostrarTurno(turno) {
  if (turno === 'jugador') {
    mostrarMensaje('Es tu turno.');
  } else if (turno === 'maquina') {
    mostrarMensaje('Turno de la máquina...');
  }
}

// Iniciar partida
fetch('/juego/iniciar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ dificultad })
})
  .then(res => res.json())
  .then(partida => {
    console.log("Respuesta de /juego/iniciar:", partida);

    ultimaPartida = partida;

    mostrarMensaje('¡La partida ha comenzado!');
    mostrarTurno(partida.turno);

    if (partida.jugador?.mano) {
      renderizarCartasJugador(partida.jugador.mano);
    }

    if (partida.maquina?.mano) {
      renderizarCartasMaquina(partida.maquina.mano);
    }
    //renderizarMesa(partida.mesa);
    manejarTurnoInicial(partida.turno);
  })
  .catch(err => {
    console.error('Error al iniciar la partida:', err);
    mostrarMensaje('Ocurrió un error al iniciar la partida.');
  });

//************************** 
// RENDERIZAR CARTAS y MESA

// Función para obtener ruta de imagen de una carta
function obtenerRutaCarta(carta, oculta = false) {
  if (oculta || !carta) {
    return 'cartas/reverso.png';
  }

  let valor = carta.valor;
  // Convertir números 11, 12, 13 a letras J, Q, K
  if (valor === 11) valor = 'J';
  else if (valor === 12) valor = 'Q';
  else if (valor === 13) valor = 'K';

  return `cartas/${valor}${carta.palo}.png`;
}

// Renderizar mano del jugador
function renderizarCartasJugador(mano) {
  console.log("Entró a renderizarCartasJugador con mano:", mano);

  const contenedor = document.getElementById('mano-jugador');
  if (!contenedor) {
    console.error("No se encontró el contenedor con id 'mano-jugador'");
    return;
  }

  contenedor.innerHTML = ''; // Limpiar contenido anterior

  if (!mano || mano.length === 0) {
    console.warn("No hay cartas para mostrar en la mano del jugador.");
    return;
  }

  mano.forEach(carta => {
    const ruta = obtenerRutaCarta(carta);
    console.log("Carta:", carta, "→ Ruta:", ruta);

    const img = document.createElement('img');
    img.src = ruta;
    img.classList.add('carta');
    contenedor.appendChild(img);

    // Solo permitir clic si es turno del jugador
    if (ultimaPartida?.turno === 'jugador') {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        console.log('Se hizo clic en la carta:', carta);
        jugarCarta(carta); // 👈 la definiremos
      });
    }

    contenedor.appendChild(img);
  });
}

// Renderizar mano de la máquina (cartas ocultas)
function renderizarCartasMaquina(mano) {
  const contenedor = document.getElementById('mano-maquina');
  contenedor.innerHTML = ''; // Limpiar
  mano.forEach(() => {
    const img = document.createElement('img');
    img.src = obtenerRutaCarta(null, true); // reverso.png
    img.classList.add('carta');
    contenedor.appendChild(img);
  });
}

function renderizarMesa(cartasEnMesa) {
  const contenedor = document.getElementById('mesa');

  if (!contenedor) {
    console.warn("No se encontró el contenedor con id 'mesa'");
    return;
  }

  // Validación: asegurarse de que sea un arreglo
  if (!Array.isArray(cartasEnMesa)) {
    console.warn("La mesa no es un arreglo válido:", cartasEnMesa);
    return;
  }

  // Limpiar la mesa antes de volver a dibujarla
  contenedor.innerHTML = '';

  cartasEnMesa.forEach(carta => {
    const img = document.createElement('img');
    img.src = obtenerRutaCarta(carta);
    img.classList.add('carta');
    contenedor.appendChild(img);
  });
}

// ****************************
// Recuperar informacion de la partida para mostrar en juego.html
function actualizarEstadoVisual(partida) {
  document.getElementById('puntos-jugador').innerText = `Puntos: ${partida.jugador.puntos}`;
  document.getElementById('puntos-maquina').innerText = `Puntos: ${partida.maquina.puntos}`;
  document.getElementById('mano-actual').innerText = partida.manoActual;
  document.getElementById('rondas-jugadas').innerText = partida.rondasJugadas;
}

// **************************************************

// TURNOS 

function manejarTurnoInicial(turno) {
  if (partidaFinalizada) {
    console.log("La partida ha finalizado. Turnos desactivados.");
    return;
  }

  if (turno === 'maquina') {
    mostrarTurno(turno);

    setTimeout(() => {
      fetch('/juego/turno-maquina', {
        method: 'POST'
      })
        .then(res => res.json())
        .then(nuevaPartida => {
          ultimaPartida = nuevaPartida.estado;
          actualizarEstadoVisual(ultimaPartida);
          mostrarMensaje(nuevaPartida.mensaje || 'La máquina ha jugado.');
          mostrarTurno(ultimaPartida.turno);
          renderizarCartasJugador(ultimaPartida.jugador.mano);
          renderizarCartasMaquina(ultimaPartida.maquina.mano);
          renderizarMesa(ultimaPartida.mesa);

          if (nuevaPartida.resultado?.ganador) {
            partidaFinalizada = true;
            mostrarPantallaFinDePartida(nuevaPartida.resultado.ganador);
            return;
          }

          // Si sigue siendo turno de la máquina, continuar el ciclo
          if (ultimaPartida.turno === 'maquina') {
            manejarTurnoInicial('maquina');
          }
        });
    }, 1000);
  }
}

function jugarCarta(carta) {
  if (partidaFinalizada) {
    console.log("La partida ha finalizado. No se puede jugar más.");
    return;
  }

  fetch('/juego/jugar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carta })
  })
    .then(res => res.json())
    .then(nuevaPartida => {
      ultimaPartida = nuevaPartida.estado;
      actualizarEstadoVisual(ultimaPartida);
      mostrarTurno(ultimaPartida.turno);
      renderizarCartasJugador(ultimaPartida.jugador.mano);
      renderizarCartasMaquina(ultimaPartida.maquina.mano);
      renderizarMesa(ultimaPartida.mesa);

      if (nuevaPartida.resultado?.ganador) {
        partidaFinalizada = true;
        mostrarPantallaFinDePartida(nuevaPartida.resultado.ganador);
        return;
      }

      // Si ahora es turno de la máquina...
      if (ultimaPartida.turno === 'maquina') {
        manejarTurnoInicial('maquina');
      }
    });
}

//******************************* 

// FINALIZAR PARTIDA
function mostrarPantallaFinDePartida(ganador) {
  const div = document.getElementById('mensaje-puntos-captura');
  div.innerText = `¡Fin de la partida!\nGanador: ${ganador === 'jugador' ? 'Tú' : 'La máquina'}`;
  div.style.display = 'block';

  // Mostrar botones
  document.getElementById('btn-volver').addEventListener('click', () => {
    partidaFinalizada = false;
    window.location.href = 'index.html';
  });
  document.getElementById('btn-revancha').addEventListener('click', () => {
    partidaFinalizada = false;
    window.location.reload();
  });
}





