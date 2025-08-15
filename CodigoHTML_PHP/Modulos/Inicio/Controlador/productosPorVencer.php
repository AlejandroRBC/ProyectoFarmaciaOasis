<?php
require_once '../../../Config/conexion.php';



// Definir el rango de fechas para considerar "próximo a vencer" (ej: 30 días)
$dias_alerta = 30;
$fecha_hoy = date('Y-m-d');
$fecha_limite = date('Y-m-d', strtotime("+$dias_alerta days"));

$sql = "SELECT nom_prod,l.nombre , fecha_expiracion 
        FROM producto p, laboratorio l
        WHERE p.fecha_expiracion BETWEEN ? AND ?
        AND p.id_laboratorio = l.id_laboratorio
        ORDER BY p.fecha_expiracion ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $fecha_hoy, $fecha_limite);
$stmt->execute();
$productos_por_vencer = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
?>