<?php
require_once '../../../config/conexion.php';

// Función para obtener el historial de productos
function obtenerHistorialProducto() {
    global $conn;

    // Ordenamos por id_producto, fecha y hora
    $sql = "SELECT * FROM HISTORIAL_PRODUCTO ORDER BY id_producto ASC, fecha DESC, hora DESC";
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
