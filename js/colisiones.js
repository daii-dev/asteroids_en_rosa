function distanciaEntrePuntos(ax, ay, bx, by) {
  return Math.sqrt((ax - bx)  **2 + (ay - by)  **2);
}

function verificarColisionBalaAsteroide() {
  for (let indiceBala = listaBalas.length - 1; indiceBala >= 0; indiceBala--) {
    const bala = listaBalas[indiceBala];

    for (let indiceAst = listaAsteroides.length - 1; indiceAst >= 0; indiceAst--) {
      const asteroide = listaAsteroides[indiceAst];
      const distancia = distanciaEntrePuntos(bala.x, bala.y, asteroide.x, asteroide.y);

      if (distancia < asteroide.tamaño * 0.8) {
        listaBalas.splice(indiceBala, 1);
        partirAsteroide(asteroide, indiceAst);
        break;
      }
    }
  }
}

function verificarColisionNaveAsteroide() {
  if (nave.frameInvulnerable > 0) return;

  for (const asteroide of listaAsteroides) {
    const distancia = distanciaEntrePuntos(nave.x, nave.y, asteroide.x, asteroide.y);

    if (distancia < asteroide.tamaño * 0.7 + 10) {
      naveImpactada();
      return;
    }
  }
}

function naveImpactada() {
  vidasRestantes--;
  crearExplosion(nave.x, nave.y);
  actualizarHUD();

  if (vidasRestantes <= 0) {
    juegoActivo = false;
    pantallaGameOver.classList.remove('oculto');
    elementoPuntajeFinal.textContent = puntaje;
  } else {
    reiniciarNave();
    nave.frameInvulnerable = TIEMPO_INVULNERABLE;
  }
}