<?php
require_once '../../../config/conexion.php';

// Función para obtener el historial de facturas cerradas
function obtenerHistorialVenta($periodo = 'semana') {
    global $conn;

    $where = '';
    if ($periodo == 'semana') {
        // Semana: desde lunes hasta hoy
        $where = "WHERE fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AND CURDATE()";
    } elseif ($periodo == 'mes') {
        // Mes: desde el día 1 hasta hoy
        $where = "WHERE fecha BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND CURDATE()";
    } elseif ($periodo == 'anio') {
        // Año: desde el 1 de enero hasta hoy
        $where = "WHERE fecha BETWEEN DATE_FORMAT(CURDATE(), '%Y-01-01') AND CURDATE()";
    }
    
    $sql = "SELECT * FROM historial_venta $where ORDER BY fecha DESC, id_historial DESC";
    $result = $conn->query($sql);

    $historial = [];
    if ($result && $result->num_rows > 0) {
        while ($fila = $result->fetch_assoc()) {
            $historial[] = $fila;
        }
    }

    return $historial;
}
?>
