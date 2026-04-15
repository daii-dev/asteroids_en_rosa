const areaJuego = document.getElementById('areaJuego');
const contexto = areaJuego.getContext('2d');

const pantallaInicio = document.getElementById('modalInicio');
const botonJugar = document.getElementById('botonjugar');

const ANCHO_AREAJUEGO = 700;
const ALTO_AREAJUEGO = 500;
areaJuego.width = ANCHO_AREAJUEGO;
areaJuego.height = ALTO_AREAJUEGO;

let juegoActivo = false;
let idAnimacion = null;

// fondo
let listaEstrellas = [];

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

// nave
let nave = {};

function reiniciarNave() {
  nave = {
    x: ANCHO_AREAJUEGO / 2,
    y: ALTO_AREAJUEGO / 2,
    angulo: -Math.PI / 2,
    velocidadX: 0,
    velocidadY: 0,
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

  contexto.strokeStyle = '#ff69b4';
  contexto.stroke();

  contexto.restore();
}

// ctroles
const teclasPresionadas = {
  izquierda: false,
  derecha: false,
  arriba: false,
};

function actualizarNave() {
  if (!juegoActivo) return;

  if (teclasPresionadas.izquierda) nave.angulo -= 0.05;
  if (teclasPresionadas.derecha) nave.angulo += 0.05;

  if (teclasPresionadas.arriba) {
    nave.x += Math.cos(nave.angulo) * 2;
    nave.y += Math.sin(nave.angulo) * 2;
  }
}

document.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') teclasPresionadas.izquierda = true;
  if (e.code === 'ArrowRight') teclasPresionadas.derecha = true;
  if (e.code === 'ArrowUp') teclasPresionadas.arriba = true;
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft') teclasPresionadas.izquierda = false;
  if (e.code === 'ArrowRight') teclasPresionadas.derecha = false;
  if (e.code === 'ArrowUp') teclasPresionadas.arriba = false;
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
    dibujarNave();
  }

  idAnimacion = requestAnimationFrame(bucleDelJuego);
}

botonJugar.addEventListener('click', comenzarJuego);

crearEstrellasFondo();
bucleDelJuego();