<?php
require_once '../Modelo/conexion.php';

// Definir qué consideramos "bajo stock" (ej: menos de 10 unidades)
$referencia_Bajo = 10;

$sql = "SELECT id_producto, nom_prod, stock, l.nombre
        FROM producto p, laboratorio l
        WHERE stock <= ? AND stock > 0
        AND p.id_laboratorio = l.id_laboratorio
        ORDER BY stock ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $referencia_Bajo);
$stmt->execute();
$productos_bajos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);


?>