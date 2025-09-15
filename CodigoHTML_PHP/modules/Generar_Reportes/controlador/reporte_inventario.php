<?php
require_once 'historial_inventario.php'; 
$datos = InventarioActual();

if(count($datos) > 0){
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr>
            <th>ID Producto</th>
            <th>Producto</th>
            <th>Lote</th>
            <th>Complemento</th>
            <th>Laboratorio</th>
            <th>Stock</th>
            <th>Precio Base</th>
            <th>Porcentaje G</th>
            <th>Precio Venta</th>
            <th>Fecha Expiración</th>
          </tr>";
    foreach($datos as $fila){
        echo "<tr>";
        echo "<td>{$fila['id_producto']}</td>";
        echo "<td>{$fila['nom_prod']}</td>";
        echo "<td>{$fila['lote']}</td>";
        echo "<td>{$fila['complemento']}</td>";
        echo "<td>{$fila['id_laboratorio']}</td>";
        echo "<td>{$fila['stock']}</td>";
        echo "<td>{$fila['precio_base']}</td>";
        echo "<td>{$fila['porcentaje_g']}</td>";
        echo "<td>{$fila['precio_venta']}</td>";
        echo "<td>{$fila['fecha_expiracion']}</td>";
        echo "</tr>";
    }

    echo "</table>";
} else {
    echo "<p>No hay productos en inventario.</p>";
}
echo '<button id="cerrarInventario">Cerrar</button>';

?>
