<?php
require_once '../Controlador/obtenerHistorialProducto.php';
$historial = obtenerHistorialProducto();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historial de Productos</title>
    <link rel="stylesheet" href="../../NavBar/Vista/css/estilos.css">
    <script src="../../NavBar/Vista/javaScript/script.js"></script>
    <link rel="stylesheet" href="../../../assets/css/titulo.css">
    <link rel="stylesheet" href="../../../assets/css/estiloTabla.css">
</head>
<body>

<?php require('../../NavBar/Vista/Principal.php'); ?>
<div class="contenido">
    <h1>Historial de Productos</h1>
    <table>
        <thead>
            <tr>
                <th>ID Producto</th>
                <th>Nombre</th>
                <th>Complemento</th>
                <th>Lote</th>
                <th>Precio Venta</th>
                <th>Stock Antiguo</th>
                <th>Stock Nuevo</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Laboratorio</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($historial)): ?>
                <tr><td colspan="11" style="text-align:center;">No hay registros en el historial de productos.</td></tr>
            <?php else: ?>
                <?php foreach ($historial as $fila): ?>
                    <tr>
                        <td><?= $fila['id_producto'] ?></td>
                        <td><?= htmlspecialchars($fila['nom_prod']) ?></td>
                        <td><?= htmlspecialchars($fila['complemento']) ?></td>
                        <td><?= $fila['lote'] ?></td>
                        <td><?= $fila['precio_venta'] ?></td>
                        <td><?= $fila['stock_antiguo'] ?></td>
                        <td><?= $fila['stock_nuevo'] ?></td>
                        <td><?= $fila['fecha'] ?></td>
                        <td><?= $fila['hora'] ?></td>
                        <td><?= htmlspecialchars($fila['nombre_laboratorio']) ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

</body>
</html>
