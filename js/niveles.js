function verificarNivelCompletado() {
  if (listaAsteroides.length === 0) {
    nivelActual++;
    actualizarHUD();
    mostrarPantallaNivel();
  }
}

function mostrarPantallaNivel() {
  juegoActivo = false;
  textNivelNuevo.textContent = `Felicidades! Vamos al nivel ${nivelActual}!`;
  pantallaNivel.classList.remove('oculto');

  setTimeout(() => {
    pantallaNivel.classList.add('oculto');
    listaBalas = [];
    reiniciarNave();
    nave.frameInvulnerable = TIEMPO_INVULNERABLE;
    generarAsteroides(CANTIDAD_ASTEROIDES_BASE + nivelActual - 1);
    juegoActivo = true;
  }, 2200);
}