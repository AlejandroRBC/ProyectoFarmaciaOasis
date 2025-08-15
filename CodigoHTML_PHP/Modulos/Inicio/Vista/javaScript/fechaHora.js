function actualizarReloj() {
  const ahora = new Date();
  
  // Formatear fecha
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-ES', opcionesFecha);
  
  // Formatear hora
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  const segundos = ahora.getSeconds().toString().padStart(2, '0');
  document.getElementById('hora').textContent = `${horas}:${minutos}:${segundos}`;
}

// Actualizar cada segundo
actualizarReloj();
setInterval(actualizarReloj, 1000);