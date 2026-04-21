function partirAsteroide(asteroide, indice) {
  listaAsteroides.splice(indice, 1);

  sumarPuntajePorAsteroide(asteroide);
  crearExplosion(asteroide.x, asteroide.y);

  if (asteroide.tamaño >= TAMAÑO_ASTEROIDE_GRANDE) {
    listaAsteroides.push(
      crearAsteroide(asteroide.x, asteroide.y, TAMAÑO_ASTEROIDE_PEQUEÑO)
    );
    listaAsteroides.push(
      crearAsteroide(asteroide.x, asteroide.y, TAMAÑO_ASTEROIDE_PEQUEÑO)
    );
  }
}