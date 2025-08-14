<?php
require_once '../../../config/conexion.php';
$fecha_hoy = date('Y-m-d');
// Consulta para sumar productos vendidos hoy en facturas CERRADAS
$sql = "SELECT SUM(dv.cantidad) as total_productos
        FROM detalleventa dv
        JOIN factura f ON dv.id_factura = f.id_factura
        WHERE f.fecha = '$fecha_hoy' AND f.estado = 'CERRADA'";

$resultado = $conn->query($sql);

if ($resultado) {
    $fila = $resultado->fetch_assoc();
    $total_productos = $fila['total_productos'] ? $fila['total_productos'] : 0;
} else {
    $total_productos = 0; // Si hay error, mostramos 0
}

require_once '../Vista/principal.php';
?>