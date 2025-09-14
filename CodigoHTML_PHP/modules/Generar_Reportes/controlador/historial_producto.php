<?php
require_once '../../../config/conexion.php';

function obtenerHistorialProducto($periodo = 'semana') {
    global $conn;

    if ($periodo == 'semana') {
        $sql = "SELECT * FROM HISTORIAL_PRODUCTO 
        WHERE fecha BETWEEN DATE_SUB(CURDATE(),INTERVAL WEEKDAY(CURDATE()) DAY)
        AND CURDATE() ORDER BY id_producto ASC, fecha DESC, hora DESC";
    } elseif ($periodo == 'mes') {
        $sql = "SELECT *
        FROM HISTORIAL_PRODUCTO
        WHERE fecha BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND CURDATE()
        ORDER BY id_producto ASC, fecha DESC, hora DESC";
    } elseif ($periodo == 'anio') {
        $sql = "SELECT MONTH(fecha) AS mes, nom_prod, lote, complemento, nombre_laboratorio,
        SUM(stock_nuevo - stock_antiguo) AS total_movimiento
        FROM HISTORIAL_PRODUCTO
        WHERE YEAR(fecha) = YEAR(CURDATE())
        GROUP BY MONTH(fecha), nom_prod, lote, complemento, nombre_laboratorio
        ORDER BY MONTH(fecha), nom_prod";
    }

    $result = $conn->query($sql);
    $historial = [];
    if ($result && $result->num_rows > 0) {
        while ($fila = $result->fetch_assoc()) {
            $historial[] = $fila;
        }
    }
    return $historial;
}
?>