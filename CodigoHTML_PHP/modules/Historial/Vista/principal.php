<?php
require_once '../Controlador/obtenerHistorialVenta.php';
$historial = obtenerHistorialVenta();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historial de Facturas</title>
    <link rel="stylesheet" href="../../NavBar/Vista/css/estilos.css">
    <script src="../../NavBar/Vista/javaScript/script.js"></script>
    <link rel="stylesheet" href="css/estiloTabla.css">
    <link rel="stylesheet" href="css/titulo.css">
</head>
<body>

<?php require('../../NavBar/Vista/Principal.php'); ?>
<div class="contenido">
    <h1>Historial de Ventas</h1>
    <table>
        <thead>
            <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>CI/NIT</th>
                <th>Método de Pago</th>
                <th>Total (Bs)</th>
                <th>Productos</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($historial)): ?>
                <tr><td colspan="8" style="text-align:center;">No hay facturas registradas en el historial.</td></tr>
            <?php else: ?>
                <?php foreach ($historial as $fila): ?>
                    <tr>
                        <td><?= $fila['id_venta'] ?></td>
                        <td><?= $fila['fecha'] ?></td>
                        <td><?= $fila['hora'] ?></td>
                        <td><?= htmlspecialchars($fila['nombre_cliente']) ?></td>
                        <td><?= htmlspecialchars($fila['ci_nit']) ?></td>
                        <td><?= htmlspecialchars(ucfirst($fila['metodo_pago'])) ?></td>
                        <td><?= $fila['total'] ?></td>
                        <td><?= htmlspecialchars($fila['productos']) ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

</body>
</html>
