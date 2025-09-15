<?php
require_once 'historial_venta.php';

$periodo = $_GET['periodo'] ?? 'semana';
$datos = reporteVenta($periodo);

$totalGanado = 0;

if ($periodo == 'semana') {
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

    foreach ($datos as $fila) {
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

    foreach ($datos as $fila) {
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
    echo "<h2>Reporte Anual</h2>";
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>Mes</th><th>Total del Mes</th></tr>";

    // Agrupar por mes con PHP
    $totalesPorMes = [];
    foreach ($datos as $fila) {
        $mes = date('m', strtotime($fila['fecha']));
        if (!isset($totalesPorMes[$mes])) {
            $totalesPorMes[$mes] = 0;
        }
        $totalesPorMes[$mes] += $fila['total'];
    }

    ksort($totalesPorMes); // ordenar por número de mes
    foreach ($totalesPorMes as $mes => $totalMes) {
        echo "<tr>";
        echo "<td>$mes</td>";
        echo "<td>$totalMes</td>";
        echo "</tr>";
        $totalGanado += $totalMes;
    }

    echo "</table>";
    echo "<p><b>Total Ganado en el Año:</b> $totalGanado</p>";
}

echo '<button id="cerrarVentas">Cerrar</button>';
?>