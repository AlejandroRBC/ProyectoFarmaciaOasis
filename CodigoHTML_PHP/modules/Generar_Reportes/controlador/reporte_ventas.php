<?php
require_once 'historial_venta.php';

$periodo = $_GET['periodo'] ?? 'semana';

global $conn;

if ($periodo == 'semana') {
    // Ventas de la semana (una por una)
    $sql = "SELECT * 
            FROM HISTORIAL_VENTA 
            WHERE YEARWEEK(fecha, 1) = YEARWEEK(CURDATE(), 1) 
            ORDER BY fecha DESC, id_historial DESC";
    $result = $conn->query($sql);

    $totalGanado = 0;
    echo "<h2>Reporte Semanal</h2>";
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Nombre</th>
            <th>CI/NIT</th>
            <th>Método Pago</th>
            <th>Productos</th>
            <th>Total</th>
        </tr>";
    while ($fila = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>{$fila['id_historial']}</td>";
        echo "<td>{$fila['fecha']}</td>";
        echo "<td>{$fila['hora']}</td>";
        echo "<td>{$fila['nombre_cliente']}</td>";
        echo "<td>{$fila['ci_nit']}</td>";
        echo "<td>{$fila['metodo_pago']}</td>";
        echo "<td>{$fila['productos']}</td>";
        echo "<td>{$fila['total']}</td>";
        echo "</tr>";
        $totalGanado += $fila['total'];
    }
    echo "</table>";
    echo "<p><b>Total Ganado en la Semana:</b> $totalGanado</p>";

} elseif ($periodo == 'mes') {
    // Ventas del mes (una por una)
    $sql = "SELECT * 
            FROM HISTORIAL_VENTA 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
              AND MONTH(fecha) = MONTH(CURDATE())
            ORDER BY fecha DESC, id_historial DESC";
    $result = $conn->query($sql);

    $totalGanado = 0;
    echo "<h2>Reporte Mensual</h2>";
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Nombre</th>
            <th>CI/NIT</th>
            <th>Método Pago</th>
            <th>Productos</th>
            <th>Total</th>
        </tr>";
    while ($fila = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>{$fila['id_historial']}</td>";
        echo "<td>{$fila['fecha']}</td>";
        echo "<td>{$fila['hora']}</td>";
        echo "<td>{$fila['nombre_cliente']}</td>";
        echo "<td>{$fila['ci_nit']}</td>";
        echo "<td>{$fila['metodo_pago']}</td>";
        echo "<td>{$fila['productos']}</td>";
        echo "<td>{$fila['total']}</td>";
        echo "</tr>";
        $totalGanado += $fila['total'];
    }
    echo "</table>";
    echo "<p><b>Total Ganado en el Mes:</b> $totalGanado</p>";

} elseif ($periodo == 'anio') {
    // Agrupado por mes
    $sql = "SELECT MONTH(fecha) AS mes, SUM(total) AS total_mes 
            FROM HISTORIAL_VENTA 
            WHERE YEAR(fecha) = YEAR(CURDATE())
            GROUP BY MONTH(fecha)
            ORDER BY MONTH(fecha)";
    $result = $conn->query($sql);

    $totalGanado = 0;
    echo "<h2>Reporte Anual</h2>";
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>Mes</th><th>Total del Mes</th></tr>";
    while ($fila = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>{$fila['mes']}</td>";
        echo "<td>{$fila['total_mes']}</td>";
        echo "</tr>";
        $totalGanado += $fila['total_mes'];
    }
    echo "</table>";
    echo "<p><b>Total Ganado en el Año:</b> $totalGanado</p>";
}
echo '<button id="cerrarVentas">Cerrar</button>';

?>