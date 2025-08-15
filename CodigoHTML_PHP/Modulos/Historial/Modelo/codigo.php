<?php
require_once '../../../Config/conexion.php';

// Función para obtener el historial de facturas cerradas
function obtenerHistorialFacturas() {
    global $conn;

    $sql = "SELECT * FROM HISTORIALFACTURA ORDER BY fecha DESC, id_historial DESC";
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
