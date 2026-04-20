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

    bala.x = ((bala.x % ANCHO_AREAJUEGO) + ANCHO_AREAJUEGO) % ANCHO_AREAJUEGO;
    bala.y = ((bala.y % ALTO_AREAJUEGO) + ALTO_AREAJUEGO) % ALTO_AREAJUEGO;

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