function actualizarFechaHora() {
  const fecha = new Date();
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('fecha').textContent = fecha.toLocaleDateString('es-ES', opcionesFecha);
  document.getElementById('hora').textContent = fecha.toLocaleTimeString('es-ES');
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();