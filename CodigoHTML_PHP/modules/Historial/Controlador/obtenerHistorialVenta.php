<?php
require_once '../../../config/conexion.php';

// Función para obtener el historial de facturas cerradas
function obtenerHistorialVenta() {
    global $conn;

    $sql = "SELECT * FROM HISTORIAL_VENTA ORDER BY fecha DESC, id_historial DESC";
    $result = $conn->query($sql);

    $historial = [];
    if ($result->num_rows > 0) {
        while ($fila = $result->fetch_assoc()) {
            $historial[] = $fila;
        }
    }

    return $historial;
}

?>
