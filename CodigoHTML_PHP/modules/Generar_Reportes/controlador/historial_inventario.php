<?php
require_once '../../../config/conexion.php';

function InventarioActual() {
    global $conn;
    $sql = "SELECT id_producto, nom_prod, precio_base, stock, fecha_expiracion, 
                   id_laboratorio, lote, porcentaje_g, complemento, precio_venta
            FROM producto
            WHERE stock > 0
            ORDER BY id_producto ASC";

    $result = $conn->query($sql);
    $inventario = [];

    if ($result && $result->num_rows > 0) {
        while ($fila = $result->fetch_assoc()) {
            $inventario[] = $fila;
        }
    }

    return $inventario;
}
?>