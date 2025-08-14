<?php

require_once '../../../config/conexion.php';// Incluye la conexión a la base de datos

/**
 * Obtiene el ID de la última factura abierta. Si no existe, crea una nueva.
 * 
 * @return int ID de la factura abierta
 */
function obtenerFacturaAbierta() {
    global $conn;
    $res = $conn->query("SELECT id_factura FROM FACTURA WHERE estado = 'ABIERTA' ORDER BY id_factura DESC LIMIT 1");
    
    if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        return $row['id_factura'];
    } else {
        $fecha = date('Y-m-d');
        $conn->query("INSERT INTO FACTURA (fecha, total, estado) VALUES ('$fecha', 0, 'ABIERTA')");
        return $conn->insert_id;
    }
}
?>
