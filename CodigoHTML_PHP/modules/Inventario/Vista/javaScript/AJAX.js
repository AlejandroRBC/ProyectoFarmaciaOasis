
document.getElementById("btn-borrar-todo").addEventListener("click", async () => {await enviarAccionCarrito("borrar_todo", 0, 0);});
document.addEventListener("DOMContentLoaded", () => {
    const carritoDiv = document.getElementById("MenuCarrito");
        carritoDiv.addEventListener("click", async (e) => {
            // Botones + / -
            if (e.target.matches(".btn-cantidad")) {
                const id = e.target.dataset.id;
                const cantidad = parseInt(e.target.dataset.cantidad);
                const accion = e.target.dataset.accion;
                await enviarAccionCarrito(accion, id, cantidad);
            }

            // Botón borrar
            if (e.target.matches(".btn-eliminar")) {
                const id = e.target.dataset.id;
                await enviarAccionCarrito("eliminar", id, 1);
            }
        });
});

async function enviarAccionCarrito(accion, id_detalle, cantidad) {
const formData = new FormData();
formData.append("ajax", "1");
formData.append("accion", accion);
formData.append("id_detalle", id_detalle);
formData.append("cantidad", cantidad);

const res = await fetch("principal.php", {
    method: "POST",
    body: formData
});

const data = await res.json();
renderCarrito(data);
}

function renderCarrito(data) {
const carrito = data.carrito;
const totalItems = data.total_items;
const totalVenta = data.total_venta; 

// Actualizar el contenido del carrito
const contenedor = document.getElementById("carrito-contenido");
if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
} else {
    let html = "";
    carrito.forEach(item => {
    html += `
        <div class="carrito-item">
        <p><strong>Nombre Producto:</strong> ${item.nom_prod}</p>
        <div>
            <strong>Cantidad:</strong>
            <span>${item.cantidad}</span>
            <button class="btn-cantidad" data-accion="aumentar" data-id="${item.id_detalle}" data-cantidad="${item.cantidad}">+</button>
            <button class="btn-cantidad" data-accion="disminuir" data-id="${item.id_detalle}" data-cantidad="${item.cantidad}">−</button>
        </div>
        <hr />
        <p>Total: ${parseFloat(item.subtotal).toFixed(2)} Bs</p>
        <button class="btn-eliminar" data-id="${item.id_detalle}">Borrar</button>
        </div>
        <hr />
    `;
    });
    contenedor.innerHTML = html;
}

// Actualizar total venta dinámicamente
const totalVentaElement = document.getElementById("total-venta");
if (totalVentaElement) {
    totalVentaElement.textContent = `TOTAL DE VENTA: ${parseFloat(totalVenta).toFixed(2)} Bs`;
}
// ✅ Actualizar contador del carrito
const contador = document.querySelector(".contador-carrito");
if (totalItems > 0) {
    if (contador) {
    contador.textContent = totalItems;
    } else {
    const span = document.createElement("span");
    span.className = "contador-carrito";
    span.textContent = totalItems;
    document.querySelector(".cart-icon").appendChild(span);
    }
} else {
    if (contador) contador.remove();
}

// ✅ Actualizar stock visual
data.productos.forEach(producto => {
    const stockSpan = document.getElementById("stock-prod-" + producto.id_producto);
    if (stockSpan) {
    stockSpan.textContent = producto.stock;
    }
});
}
