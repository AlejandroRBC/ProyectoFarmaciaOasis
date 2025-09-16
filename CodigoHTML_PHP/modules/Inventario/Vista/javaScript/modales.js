// Mostrar u ocultar el carrito
function mostrarCarrito() {
    const menu = document.getElementById('MenuCarrito');
    menu.classList.toggle('activo');
}

function abrirModalAgregar() {
    document.getElementById('modalAgregar').classList.add('abierto')
}

function cerrarModalAgregar() {
    document.getElementById('modalAgregar').classList.remove('abierto')
}

function abrirModalAgregarLaboratorio() {
    document.getElementById('modalAgregarLaboratorio').classList.add('abierto')
}

function cerrarModalAgregarLaboratorio() {
    document.getElementById('modalAgregarLaboratorio').classList.remove('abierto')
}


function abrirModalModificar(
                            id, 
                            nombre,
                            lote, 
                            precio_base, 
                            stock,
                            fecha_exp, 
                            id_laboratorio, 
                            porcentaje_g,
                            complemento
                        ) {
    document.getElementById('modalModificar').classList.remove('cerrar')
    console.log("probar");
    document.getElementById('mod_id_producto').value      = id;
    document.getElementById('mod_nombre').value           = nombre;
    document.getElementById('mod_lote').value             = lote;
    document.getElementById('mod_precio').value           = precio_base;
    document.getElementById('mod_stock').value            = stock;
    document.getElementById('mod_fecha_expiracion').value = fecha_exp;
    document.getElementById('mod_id_laboratorio').value   = id_laboratorio;
    document.getElementById('mod_complemento').value   = complemento;

    document.getElementById('mod_porcentaje').placeholder = "Actual: " + porcentaje_g + "%";
    document.getElementById("modalModificar").classList.add('abierto')
    console.log("probar2");
    
}


function cerrarModalModificar() {
    document.getElementById("modalModificar").classList.remove('abierto')
}

function abrirModalEliminar(id) {
    document.getElementById("elim_id_producto").value = id;
    document.getElementById("modalEliminar").classList.add('abierto')
}

function cerrarModalEliminar() {
    document.getElementById("modalEliminar").classList.remove('abierto')
}

function mostrarModal() {
    let totalVentaElem = document.getElementById('total-venta');
    let total = parseFloat(totalVentaElem.textContent.replace(/[^\d.-]/g, ''));
    if (total > 0) {
        document.getElementById('modalCompra').classList.add('abierto');
    } else {
        alert('El carrito está vacío. No se puede realizar la compra.');
    }
}

function cerrarModal() {
    document.getElementById('modalCompra').classList.remove('abierto')
}

function VentaRapida() {
    let totalVentaElem = document.getElementById('total-venta');
    let total = parseFloat(totalVentaElem.textContent.replace(/[^\d.-]/g, ''));
    if (total > 0) {
        document.getElementById('modalVentaRapida').classList.add('abierto');
    } else {
        alert('El carrito está vacío. No se puede realizar la compra.');
    }
}

function cerrarVentaRapida() {
    document.getElementById('modalVentaRapida').classList.remove('abierto')
}



// SCRIPT PARA CIERRE FUERA DE LOS MODALES
document.addEventListener('click', function(event) {
// MODAL AGREGAR PRODUCTO
const modalAgregar = document.getElementById('modalAgregar');
if (event.target === modalAgregar) {
    cerrarModalAgregar();
}

// MODAL AGREGAR LABORATORIO
const modalLab = document.getElementById('modalAgregarLaboratorio');
if (event.target === modalLab) {
    cerrarModalAgregarLaboratorio();
}

// MODAL MODIFICAR PRODUCTO
const modalMod = document.getElementById('modalModificar');
if (event.target === modalMod) {
    cerrarModalModificar();
}

// MODAL ELIMINAR PRODUCTO
const modalElim = document.getElementById('modalEliminar');
if (event.target === modalElim) {
    cerrarModalEliminar();
}

// MODAL COMPRA (Datos del Cliente)
const modalCompra = document.getElementById('modalCompra');
if (event.target === modalCompra) {
    cerrarModal();
}

// CARRITO LATERAL
const carrito = document.getElementById('MenuCarrito');
if (carrito.classList.contains('activo') && !carrito.contains(event.target) && !event.target.closest('.cart-icon')) {
    carrito.classList.remove('activo');
}
});