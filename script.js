const areaJuego = document.getElementById('areaJuego');
const contexto = areaJuego.getContext('2d');

const elementoMarcador = document.getElementById('marcador');
const elementoVidas = document.getElementById('vidas');
const elementoNivel = document.getElementById('nivel');
const elementoPuntajeFinal = document.getElementById('puntajeFinal');
const textNivelNuevo = document.getElementById('textoNivelnuevo');

const pantallaInicio = document.getElementById('modalInicio');
const pantallaGameOver = document.getElementById('modalGameover');
const pantallaNivel = document.getElementById('modalNivel');

const botonJugar = document.getElementById('botonjugar');
const botonReiniciar = document.getElementById('botonreiniciar');

const ANCHO_AREAJUEGO = 700;
const ALTO_AREAJUEGO = 500;
areaJuego.width = ANCHO_AREAJUEGO;
areaJuego.height = ALTO_AREAJUEGO;

const VELOCIDAD_ROTACION = 0.05; 
const FUERZA_IMPULSO = 0.15; 
const DESACELERACION = 0.99;
const VELOCIDAD_BALA = 7;     
const VIDA_BALA = 55;  
const TAMAÑO_ASTEROIDE_GRANDE = 45;
const CANTIDAD_ASTEROIDES_BASE = 3;

const COLOR_NAVE = '#ff69b4';
const COLOR_BALA = '#ff1493';
const COLOR_BORDE_AST = '#ff80ab';
const COLOR_ESTRELLA  = 'rgba(255, 182, 217, 0.8)';

let puntaje         = 0;
let vidasRestantes  = 3;
let nivelActual     = 1;
let juegoActivo = false;
let animacion = null;

let nave = {};
let listaAsteroides = [];
let listaBalas = [];
let listaEstrellas = [];

const teclasPresionadas = {
  izquierda : false,
  derecha : false,
  arriba : false,
  disparar : false,
};
let puedeDisparar = true;

function inicializarJuego() {
  puntaje = 0;
  vidasRestantes = 3;
  nivelActual = 1;

  actualizarHUD();
  crearEstrellasFondo();
  reiniciarNave();
  generarAsteroides(CANTIDAD_ASTEROIDES_BASE);

  listaBalas = [];
}

function reiniciarNave() {
  nave = {
    x: ANCHO_AREAJUEGO / 2,
    y: ALTO_AREAJUEGO / 2,
    angulo: -Math.PI / 2,
    velocidadX: 0,
    velocidadY: 0,
    impulsando : false,
    frameInvulnerable : 0,
  };
}

//fondo galaxia
function crearEstrellasFondo() {
  listaEstrellas = [];
  for (let i = 0; i < 80; i++) {
    listaEstrellas.push({
      x: Math.random() * ANCHO_AREAJUEGO,
      y: Math.random() * ALTO_AREAJUEGO,
      radio: Math.random() * 1.5 + 0.5,
      opacidad: Math.random() * 0.6 + 0.2,
    });
  }
}

//asteroides
function generarAsteroides(cantidad) {
  listaAsteroides = [];
  for (let i = 0; i < cantidad; i++) {
    listaAsteroides.push(crearAsteroide(null, null, TAMAÑO_ASTEROIDE_GRANDE));
  }
}

function crearAsteroide(posicionX, posicionY, tamaño) {
  if (posicionX === null || posicionY === null) {
    const lado = Math.floor(Math.random() * 4);

    if (lado === 0) {
      posicionX = Math.random() * ANCHO_AREAJUEGO;
      posicionY = 0;
    } else if (lado === 1) {
      posicionX = ANCHO_AREAJUEGO;
      posicionY = Math.random() * ALTO_AREAJUEGO;
    } else if (lado === 2) {
      posicionX = Math.random() * ANCHO_AREAJUEGO;
      posicionY = ALTO_AREAJUEGO;
    } else {
      posicionX = 0;
      posicionY = Math.random() * ALTO_AREAJUEGO;
    }
  }

  const velocidadBase = 0.8 + nivelActual * 0.2;
  const anguloMovimiento = Math.random() * Math.PI * 2;

  const cantidadVertices = Math.floor(Math.random() * 4) + 7;
  const vertices = [];

  for (let i = 0; i < cantidadVertices; i++) {
    const angulo = (i / cantidadVertices) * Math.PI * 2;
    const variacion = tamaño * (0.7 + Math.random() * 0.5);

    vertices.push({
      x: Math.cos(angulo) * variacion,
      y: Math.sin(angulo) * variacion,
    });
  }

  return {
    x: posicionX,
    y: posicionY,
    velocidadX: Math.cos(anguloMovimiento) * velocidadBase,
    velocidadY: Math.sin(anguloMovimiento) * velocidadBase,
    tamaño: tamaño,
    rotacion: 0,
    velocidadRotacion: (Math.random() - 0.5) * 0.04,
    vertices: vertices,
  };
}

function actualizarAsteroides() {
  for (const asteroide of listaAsteroides) {
    asteroide.x += asteroide.velocidadX;
    asteroide.y += asteroide.velocidadY;
    asteroide.rotacion += asteroide.velocidadRotacion;

    asteroide.x = ((asteroide.x % ANCHO_AREAJUEGO) + ANCHO_AREAJUEGO) % ANCHO_AREAJUEGO;
    asteroide.y = ((asteroide.y % ALTO_AREAJUEGO) + ALTO_AREAJUEGO) % ALTO_AREAJUEGO;
  }
}

function dibujarAsteroides() {
  for (const asteroide of listaAsteroides) {
    contexto.save();
    contexto.translate(asteroide.x, asteroide.y);
    contexto.rotate(asteroide.rotacion);

    contexto.beginPath();
    contexto.moveTo(asteroide.vertices[0].x, asteroide.vertices[0].y);

    for (let i = 1; i < asteroide.vertices.length; i++) {
      contexto.lineTo(asteroide.vertices[i].x, asteroide.vertices[i].y);
    }

    contexto.closePath();
    contexto.strokeStyle = COLOR_BORDE_AST;
    contexto.lineWidth = 2;
    contexto.fillStyle = 'rgba(194, 24, 91, 0.25)';
    contexto.fill();
    contexto.stroke();
    contexto.restore();
  }
}


//nave
function actualizarNave() {
  if (!juegoActivo) return;
  //rotacion
  if (teclasPresionadas.izquierda) nave.angulo -= VELOCIDAD_ROTACION;
  if (teclasPresionadas.derecha) nave.angulo += VELOCIDAD_ROTACION;

  //impulso
  nave.impulsando = teclasPresionadas.arriba;
  if (nave.impulsando) {
    nave.velocidadX += Math.cos(nave.angulo) * FUERZA_IMPULSO;
    nave.velocidadY += Math.sin(nave.angulo) * FUERZA_IMPULSO;
  }

  //desaceleracion
  nave.velocidadX *= DESACELERACION;
  nave.velocidadY *= DESACELERACION;

  //mover nave
  nave.x += nave.velocidadX;
  nave.y += nave.velocidadY;

  //wraparound
  nave.x = ((nave.x % ANCHO_AREAJUEGO) + ANCHO_AREAJUEGO) % ANCHO_AREAJUEGO;
  nave.y = ((nave.y % ALTO_AREAJUEGO)  + ALTO_AREAJUEGO)  % ALTO_AREAJUEGO;

  //disparo
  if (teclasPresionadas.disparar && puedeDisparar) {
    disparar();
    puedeDisparar = false;
  }

  if (!teclasPresionadas.disparar) {
    puedeDisparar = true;
  }
}

function dibujarNave() {
  contexto.save();
  contexto.translate(nave.x, nave.y);
  contexto.rotate(nave.angulo);

  contexto.beginPath();
  contexto.moveTo(18, 0);
  contexto.lineTo(-12, -10);
  contexto.lineTo(-6, 0);
  contexto.lineTo(-12, 10);
  contexto.closePath();

  contexto.strokeStyle = COLOR_NAVE;
  contexto.lineWidth = 2;
  contexto.fillStyle = 'rgba(255, 105, 180, 0.15)';
  contexto.fill();
  contexto.stroke();

  if (nave.impulsando) {
    contexto.beginPath();
    contexto.moveTo(-6, -5);
    contexto.lineTo(-20 - Math.random() * 8, 0);
    contexto.lineTo(-6, 5);
    contexto.strokeStyle = '#ff1493';
    contexto.lineWidth = 2;
    contexto.stroke();
  }

  contexto.restore();
}

//balas
function disparar() {
  listaBalas.push({
    x: nave.x + Math.cos(nave.angulo) * 20,
    y: nave.y + Math.sin(nave.angulo) * 20,
    velocidadX: nave.velocidadX + Math.cos(nave.angulo) * VELOCIDAD_BALA,
    velocidadY: nave.velocidadY + Math.sin(nave.angulo) * VELOCIDAD_BALA,
    vidaRestante: VIDA_BALA,
  });
}

function actualizarBalas() {
  for (let i = listaBalas.length - 1; i >= 0; i--) {
    const bala = listaBalas[i];
    bala.x += bala.velocidadX;
    bala.y += bala.velocidadY;
    bala.vidaRestante--;

    //wraparound
    bala.x = ((bala.x % ANCHO_AREAJUEGO) + ANCHO_AREAJUEGO) % ANCHO_AREAJUEGO;
    bala.y = ((bala.y % ALTO_AREAJUEGO)  + ALTO_AREAJUEGO)  % ALTO_AREAJUEGO;

    if (bala.vidaRestante <= 0) {
      listaBalas.splice(i, 1);
    }
  }
}

function dibujarBalas() {
  for (const bala of listaBalas) {
    contexto.beginPath();
    contexto.arc(bala.x, bala.y, 3, 0, Math.PI * 2);
    contexto.fillStyle = COLOR_BALA;
    contexto.shadowColor = '#ff1493';
    contexto.shadowBlur = 8;
    contexto.fill();
    contexto.shadowBlur = 0;
  }
}

//colisiones
function distanciaEntrePuntos(ax, ay, bx, by) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function verificarColisionBalaAsteroide() {
  for (let indiceBala = listaBalas.length - 1; indiceBala >= 0; indiceBala--) {
    const bala = listaBalas[indiceBala];

    for (let indiceAst = listaAsteroides.length - 1; indiceAst >= 0; indiceAst--) {
      const asteroide = listaAsteroides[indiceAst];
      const distancia = distanciaEntrePuntos(bala.x, bala.y, asteroide.x, asteroide.y);

      if (distancia < asteroide.tamaño * 0.8) {
        listaBalas.splice(indiceBala, 1);
        listaAsteroides.splice(indiceAst, 1);
        break;
      }
    }
  }
}

function dibujarFondo() {
  contexto.fillStyle = '#0d001a';
  contexto.fillRect(0, 0, ANCHO_AREAJUEGO, ALTO_AREAJUEGO);

  for (const estrella of listaEstrellas) {
    contexto.beginPath();
    contexto.arc(estrella.x, estrella.y, estrella.radio, 0, Math.PI * 2);
    contexto.fillStyle = `rgba(255, 182, 217, ${estrella.opacidad})`;
    contexto.fill();
  }
}

function actualizarHUD() {
  elementoMarcador.textContent = puntaje;
  elementoVidas.textContent = vidasRestantes;
  elementoNivel.textContent = nivelActual;
}

function comenzarJuego() {
  pantallaInicio.classList.add('oculto');
  inicializarJuego();
  juegoActivo = true;

  if (animacion) {
    cancelAnimationFrame(animacion);
  }

  bucleDelJuego();
}

function bucleDelJuego() {
  dibujarFondo();

  if (juegoActivo) {
    actualizarNave();
    actualizarBalas();
    actualizarAsteroides();
    verificarColisionBalaAsteroide();
  }
  dibujarAsteroides();
  dibujarBalas();
  dibujarNave();

  animacion = requestAnimationFrame(bucleDelJuego);
}

//tecado
document.addEventListener('keydown', (evento) => {
  switch (evento.code) {
    case 'ArrowLeft': teclasPresionadas.izquierda = true;  break;
    case 'ArrowRight': teclasPresionadas.derecha = true;  break;
    case 'ArrowUp': teclasPresionadas.arriba = true;  break;
    case 'Space': teclasPresionadas.disparar = true; 
      evento.preventDefault();
      break;
  }
});

document.addEventListener('keyup', (evento) => {
  switch (evento.code) {
    case 'ArrowLeft': teclasPresionadas.izquierda = false; break;
    case 'ArrowRight': teclasPresionadas.derecha = false; break;
    case 'ArrowUp': teclasPresionadas.arriba = false; break;
    case 'Space': teclasPresionadas.disparar = false; break;
  }
});

botonJugar.addEventListener('click', comenzarJuego);

crearEstrellasFondo();
bucleDelJuego();