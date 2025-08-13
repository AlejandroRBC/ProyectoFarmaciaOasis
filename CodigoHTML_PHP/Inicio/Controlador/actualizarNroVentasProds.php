<?php
require_once '../../config/conexion.php';

$fecha_hoy = date('Y-m-d');

// Consulta para contar facturas CERRADAS hoy
$sql_ventas =  "SELECT COUNT(id_factura) as total_ventas 
                FROM factura 
                WHERE fecha = '$fecha_hoy' AND estado = 'CERRADA'";

$resultado_ventas = $conn->query($sql_ventas);
$total_ventas = $resultado_ventas->fetch_assoc()['total_ventas'] ?? 0;

// Consulta para productos vendidos 
$sql_productos = "SELECT SUM(dv.cantidad) as total_productos
                    FROM detalleventa dv
                    JOIN factura f ON dv.id_factura = f.id_factura
                    WHERE f.fecha = '$fecha_hoy' AND f.estado = 'CERRADA'";

$resultado_productos = $conn->query($sql_productos);
$total_productos = $resultado_productos->fetch_assoc()['total_productos'] ?? 0;

require_once '../Vista/principal.php';
?>