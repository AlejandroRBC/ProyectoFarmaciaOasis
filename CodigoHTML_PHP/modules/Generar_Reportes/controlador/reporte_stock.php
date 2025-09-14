<?php
require_once 'historial_producto.php';

$periodo = $_GET['periodo'] ?? 'semana';
$datos = obtenerHistorialProducto($periodo);

if(count($datos) > 0){
    // Título del reporte
    if($periodo == 'anio'){
        echo "<h2>Reporte Anual</h2>";
    } elseif($periodo == 'mes'){
        echo "<h2>Reporte Mensual</h2>";
    } else {
        echo "<h2>Reporte Semanal</h2>";
    }

    echo "<table border='1' cellpadding='5' cellspacing='0'>";

    if($periodo == 'anio'){
        echo "<tr>
                <th>Mes</th>
                <th>Producto</th>
                <th>Lote</th>
                <th>Complemento</th>
                <th>Laboratorio</th>
                <th>Total Movimiento</th>
              </tr>";

        foreach($datos as $fila){
            $movimiento = $fila['total_movimiento'] ?? ($fila['stock_nuevo'] - $fila['stock_antiguo']);
            $color = $movimiento < 0 ? 'red' : 'green';

            echo "<tr>";
            echo "<td>{$fila['mes']}</td>";
            echo "<td>{$fila['nom_prod']}</td>";
            echo "<td>{$fila['lote']}</td>";
            echo "<td>{$fila['complemento']}</td>";
            echo "<td>{$fila['nombre_laboratorio']}</td>";
            echo "<td style='color:$color'>{$movimiento}</td>";
            echo "</tr>";
        }

    } else {
        // Cabecera para semana y mes
        echo "<tr>
                <th>ID Producto</th>
                <th>Lote</th>
                <th>Producto</th>
                <th>Complemento</th>
                <th>Precio de Venta</th>
                <th>Stock Anterior</th>
                <th>Stock Nuevo</th>
                <th>Movimiento</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Laboratorio</th>
              </tr>";

        foreach($datos as $fila){
            $movimiento = $fila['stock_nuevo'] - $fila['stock_antiguo'];
            $color = $movimiento < 0 ? 'red' : 'green';

            echo "<tr>";
            echo "<td>{$fila['id_producto']}</td>";
            echo "<td>{$fila['lote']}</td>";
            echo "<td>{$fila['nom_prod']}</td>";
            echo "<td>{$fila['complemento']}</td>";
            echo "<td>{$fila['precio_venta']}</td>";
            echo "<td>{$fila['stock_antiguo']}</td>";
            echo "<td>{$fila['stock_nuevo']}</td>";
            echo "<td style='color:$color'>{$movimiento}</td>";
            echo "<td>{$fila['fecha']}</td>";
            echo "<td>{$fila['hora']}</td>";
            echo "<td>{$fila['nombre_laboratorio']}</td>";
            echo "</tr>";
        }
    }

    echo "</table>";
} else {
    echo "<p>No hay registros para el período seleccionado.</p>";
}
echo '<button id="cerrarProducto">Cerrar</button>';

?>
