// Lógica de filtrado en tiempo real en la tabla
const inputBusqueda = document.querySelector('.busqueda');
const tabla = document.querySelector('tbody');
inputBusqueda.addEventListener('input', filtrarTabla);
document.getElementById('btnBuscar').addEventListener('click', filtrarTabla);
inputBusqueda.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        filtrarTabla();
    }
});

function filtrarTabla() {
    const filtro = inputBusqueda.value.toLowerCase();
    Array.from(tabla.rows).forEach(row => {
        const codigo = row.cells[0].textContent.toLowerCase();
        const lote = row.cells[1].textContent.toLowerCase();
        const nombre = row.cells[2].textContent.toLowerCase();
        row.style.display = (lote.startsWith(filtro) || codigo.startsWith(filtro) || nombre.startsWith(filtro)) ? '' : 'none';
    });
}
