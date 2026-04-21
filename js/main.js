const areaJuego = document.getElementById('areaJuego');
const contexto = areaJuego.getContext('2d');

const elementoMarcador      = document.getElementById('marcador');
const elementoVidas         = document.getElementById('vidas');
const elementoNivel         = document.getElementById('nivel');
const elementoPuntajeFinal  = document.getElementById('puntajeFinal');
const textNivelNuevo        = document.getElementById('textoNivelnuevo');

const pantallaInicio   = document.getElementById('modalInicio');
const pantallaGameOver = document.getElementById('modalGameover');
const pantallaNivel    = document.getElementById('modalNivel');

const botonJugar     = document.getElementById('botonjugar');
const botonReiniciar = document.getElementById('botonreiniciar');

const ANCHO_AREAJUEGO  = 700;
const ALTO_AREAJUEGO   = 500;
areaJuego.width  = ANCHO_AREAJUEGO;
areaJuego.height = ALTO_AREAJUEGO;

const VELOCIDAD_ROTACION       = 0.05;
const FUERZA_IMPULSO           = 0.15;
const DESACELERACION           = 0.99;
const VELOCIDAD_BALA           = 7;
const VIDA_BALA                = 55;
const TIEMPO_INVULNERABLE      = 150;
const TAMAÑO_ASTEROIDE_GRANDE  = 45;
const CANTIDAD_ASTEROIDES_BASE = 3;

const COLOR_NAVE      = '#ff69b4';
const COLOR_BALA      = '#ff1493';
const COLOR_BORDE_AST = '#ff80ab';
const COLOR_ESTRELLA  = 'rgba(255, 182, 217, 0.8)';

let puntaje         = 0;
let vidasRestantes  = 3;
let nivelActual     = 1;
let juegoActivo     = false;
let animacion       = null;

let nave = {};
let listaAsteroides = [];
let listaBalas      = [];
let listaExplosiones = [];
let listaEstrellas  = [];

const teclasPresionadas = {
  izquierda : false,
  derecha   : false,
  arriba    : false,
  disparar  : false,
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
  listaExplosiones = [];
}

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
  pantallaGameOver.classList.add('oculto');
  inicializarJuego();
  juegoActivo = true;
}


function bucleDelJuego() {
  dibujarFondo();

  if (juegoActivo) {
    actualizarNave();
    actualizarBalas();
    actualizarAsteroides();
    verificarColisionBalaAsteroide();
    verificarColisionNaveAsteroide();
  }

  dibujarAsteroides();
  dibujarBalas();
  dibujarNave();

  animacion = requestAnimationFrame(bucleDelJuego);
}


document.addEventListener('keydown', (evento) => {
  switch (evento.code) {
    case 'ArrowLeft':  teclasPresionadas.izquierda = true; break;
    case 'ArrowRight': teclasPresionadas.derecha   = true; break;
    case 'ArrowUp':    teclasPresionadas.arriba    = true; break;
    case 'Space':
      teclasPresionadas.disparar = true;
      evento.preventDefault();
      break;
  }
});

document.addEventListener('keyup', (evento) => {
  switch (evento.code) {
    case 'ArrowLeft':  teclasPresionadas.izquierda = false; break;
    case 'ArrowRight': teclasPresionadas.derecha   = false; break;
    case 'ArrowUp':    teclasPresionadas.arriba    = false; break;
    case 'Space':      teclasPresionadas.disparar  = false; break;
  }
});


botonJugar.addEventListener('click', comenzarJuego);
botonReiniciar.addEventListener('click', comenzarJuego);

crearEstrellasFondo();
bucleDelJuego();