function reiniciarNave() {
  nave = {
    x: ANCHO_AREAJUEGO / 2,
    y: ALTO_AREAJUEGO / 2,
    angulo: -Math.PI / 2,
    velocidadX: 0,
    velocidadY: 0,
    impulsando: false,
    frameInvulnerable: 0,
  };
}

function actualizarNave() {
  if (!juegoActivo) return;

  if (teclasPresionadas.izquierda) nave.angulo -= VELOCIDAD_ROTACION;
  if (teclasPresionadas.derecha)   nave.angulo += VELOCIDAD_ROTACION;

  nave.impulsando = teclasPresionadas.arriba;
  if (nave.impulsando) {
    nave.velocidadX += Math.cos(nave.angulo) * FUERZA_IMPULSO;
    nave.velocidadY += Math.sin(nave.angulo) * FUERZA_IMPULSO;
  }

  nave.velocidadX *= DESACELERACION;
  nave.velocidadY *= DESACELERACION;

  nave.x += nave.velocidadX;
  nave.y += nave.velocidadY;

  nave.x = ((nave.x % ANCHO_AREAJUEGO) + ANCHO_AREAJUEGO) % ANCHO_AREAJUEGO;
  nave.y = ((nave.y % ALTO_AREAJUEGO) + ALTO_AREAJUEGO) % ALTO_AREAJUEGO;

  if (teclasPresionadas.disparar && puedeDisparar) {
    disparar();
    puedeDisparar = false;
  }

  if (!teclasPresionadas.disparar) {
    puedeDisparar = true;
  }
}

function dibujarNave() {
  if (nave.x === undefined || nave.y === undefined) return;

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