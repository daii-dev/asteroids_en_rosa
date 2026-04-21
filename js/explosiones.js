function crearExplosion(x, y) {
  const cantidadParticulas = 12;

  for (let i = 0; i < cantidadParticulas; i++) {
    const angulo = (i / cantidadParticulas) * Math.PI * 2;
    const velocidad = Math.random() * 2.5 + 0.5;

    listaExplosiones.push({
      x: x,
      y: y,
      velocidadX: Math.cos(angulo) * velocidad,
      velocidadY: Math.sin(angulo) * velocidad,
      vida: 30 + Math.random() * 20,
      vidaMax: 50,
      radio: Math.random() * 3 + 1,
    });
  }
}

function actualizarExplosiones() {
  for (let i = listaExplosiones.length - 1; i >= 0; i--) {
    const particula = listaExplosiones[i];

    particula.x += particula.velocidadX;
    particula.y += particula.velocidadY;
    particula.vida--;

    if (particula.vida <= 0) {
      listaExplosiones.splice(i, 1);
    }
  }
}

function dibujarExplosiones() {
  for (const particula of listaExplosiones) {
    const opacidad = particula.vida / particula.vidaMax;

    contexto.beginPath();
    contexto.arc(particula.x, particula.y, particula.radio, 0, Math.PI * 2);
    contexto.fillStyle = `rgba(255, 105, 180, ${opacidad})`;
    contexto.fill();
  }
}