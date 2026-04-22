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