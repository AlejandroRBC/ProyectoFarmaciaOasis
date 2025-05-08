<link rel="stylesheet" href="css/estilos.css">

<?php
for ($i=0; $i < 2; $i++) { 
    $direccion = "ibuprofeno.png";
    $nombre = "Paracetamol";
    $precio = 10;  // Precio como número para cálculo
    $precioFormateado = $precio . " bs";  // Precio formateado para mostrar
    
    echo '<div class="cajaProd" data-precio="'.$precio.'" id="producto-'.$i.'">';
        echo'<img src="img/'.$direccion.'" alt="">';
        echo'
            <div>
                <h1>'.$nombre.'</h1>
                <span>'.$precioFormateado.'</span>
            </div>
        ';
        echo'
        <div class="contador">
            <button type="button" onclick="cambiarCantidad('.$i.', -1)">-</button>
            <span id="cantidad-'.$i.'" >1</span>
            <button type="button" onclick="cambiarCantidad('.$i.', 1)">+</button>
        </div>
        ';
        echo '<div id="total-'.$i.'">'.$precioFormateado.'</div>';
        echo '<div>BTN CANTIDAD</div>';
    echo'</div>';
}
?>

<div id="total-general" style="font-weight: bold; margin-top: 20px;">TOTAL: 0 bs</div>

<script>
// Objeto para llevar registro de las cantidades
const cantidades = {};

function cambiarCantidad(id, cambio) {
    // Obtener elementos
    const elementoCantidad = document.getElementById(`cantidad-${id}`);
    const elementoTotalItem = document.getElementById(`total-${id}`);
    const producto = document.getElementById(`producto-${id}`);
    const precio = parseFloat(producto.dataset.precio);
    
    // Calcular nueva cantidad
    let cantidad = parseInt(elementoCantidad.textContent) + cambio;
    if (cantidad < 1) cantidad = 1;  // No permitir cantidades negativas
    
    // Actualizar la cantidad
    elementoCantidad.textContent = cantidad;
    cantidades[id] = cantidad;
    
    // Calcular y actualizar total por item
    const totalItem = precio * cantidad;
    elementoTotalItem.textContent = totalItem.toFixed(2) + " bs";
    
    // Calcular y actualizar total general
    calcularTotalGeneral();
}

function calcularTotalGeneral() {
    const productos = document.querySelectorAll('.cajaProd');
    let total = 0;
    
    productos.forEach(producto => {
        const id = producto.id.split('-')[1];
        const precio = parseFloat(producto.dataset.precio);
        const cantidad = cantidades[id] || 1;  // Usar 1 si no está definido
        
        total += precio * cantidad;
    });
    
    document.getElementById('total-general').textContent = `TOTAL: ${total.toFixed(2)} bs`;
}


</script>