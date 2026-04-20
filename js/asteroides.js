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