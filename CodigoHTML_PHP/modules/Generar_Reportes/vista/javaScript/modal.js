// para el modal
const modal = document.getElementById("modalExcel");
const abrirVentas = document.getElementById("abrirModalVentas");
const abrirProducto = document.getElementById("abrirModalProducto");
const abrirInventario = document.getElementById("abrirModalInventario");
const cerrarBtn = document.getElementById("cerrarModal");
const aceptarBtn = document.getElementById("aceptarBtn");
abrirVentas.onclick = abrirProducto.onclick = abrirInventario.onclick = function(){
    modal.style.display = "block";
}
aceptarBtn.onclick = function(){
    modal.style.display = "none";
}
cerrarBtn.onclick = function(){
    modal.style.display = "none";
}
window.onclick = function(){
    if(event.target == modal){
        modal.style.display = "none";
    }
}