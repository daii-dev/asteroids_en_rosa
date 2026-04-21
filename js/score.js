function sumarPuntajePorAsteroide(asteroide) {
  if (asteroide.tamaño >= TAMAÑO_ASTEROIDE_GRANDE) {
    puntaje += PUNTOS_GRANDE;
  } else {
    puntaje += PUNTOS_PEQUEÑO;
  }

  actualizarHUD();
}