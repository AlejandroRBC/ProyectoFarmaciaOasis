<?php
require_once '../Modelo/conexion.php';


// Definir el rango de fechas para considerar "próximo a vencer" (ej: 30 días)
$dias_alerta = 30;
$fecha_hoy = date('Y-m-d');
$fecha_limite = date('Y-m-d', strtotime("+$dias_alerta days"));

$sql = "SELECT nom_prod, fecha_expiracion 
        FROM producto
        WHERE fecha_expiracion BETWEEN ? AND ?
        ORDER BY fecha_expiracion ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $fecha_hoy, $fecha_limite);
$stmt->execute();
$productos_por_vencer = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
?>