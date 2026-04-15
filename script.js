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
const COLOR_NAVE = '#ff69b4';

const VELOCIDAD_BALA = 7;     
const VIDA_BALA = 55;    
const COLOR_BALA = '#ff1493';

let juegoActivo = false;
let animacion = null;

let listaBalas = [];
let listaEstrellas = [];

const teclasPresionadas = {
  izquierda : false,
  derecha : false,
  arriba : false,
  disparar : false,
};
let puedeDisparar = true;

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

//nave
let nave = {};

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

  contexto.restore();
}

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
    contexto.fill();
  }
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

function comenzarJuego() {
  pantallaInicio.classList.add('oculto');
  juegoActivo = true;
  reiniciarNave();
}

function bucleDelJuego() {
  dibujarFondo();

  if (juegoActivo) {
    actualizarNave();
    actualizarBalas();
  }
  dibujarBalas();
  dibujarNave();

  animacion = requestAnimationFrame(bucleDelJuego);
}

botonJugar.addEventListener('click', comenzarJuego);

crearEstrellasFondo();
bucleDelJuego();