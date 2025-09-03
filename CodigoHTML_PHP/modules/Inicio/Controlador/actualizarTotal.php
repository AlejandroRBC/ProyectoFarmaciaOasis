<?php
require_once '../../../config/conexion.php';

$fecha_hoy = date('Y-m-d');

$sql = "SELECT SUM(total) as totalHoy 
        FROM venta 
        WHERE fecha = '$fecha_hoy' 
        AND estado = 'CERRADA'";

$resultado = $conn->query($sql);

if ($resultado) {
    $fila = $resultado->fetch_assoc();
    $totalHoy = $fila['totalHoy'] ? $fila['totalHoy'] : 0;
} else {
    $totalHoy = "Error";
}

//pasar datos a la vista
require_once '../Vista/principal.php';
?>