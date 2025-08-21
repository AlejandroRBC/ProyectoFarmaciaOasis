<?php
require_once '../Controlador/obtenerHistorialFact.php';
$historial = obtenerHistorialFacturas();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historial de Facturas</title>
    <link rel="stylesheet" href="../../NavBar/Vista/css/estilos.css">
    <script src="../../NavBar/Vista/javaScript/script.js"></script>

<link rel="stylesheet" href="../../../assets/css/estiloTabla.css">
<link rel="stylesheet" href="../../../assets/css/titulo.css">
</head>
<body>

    <?php require('../../NavBar/Vista/Principal.php'); ?>
    <div class="contenido">
            <h1>Historial de Facturas</h1>
        <table>
            <thead>
                <tr>
                    <th>ID Factura</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>CI/NIT</th>
                    <th>Total (Bs)</th>
                    <th>Productos</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($historial)): ?>
                    <tr><td colspan="6" style="text-align:center;">No hay facturas registradas en el historial.</td></tr>
                <?php else: ?>
                    <?php foreach ($historial as $fila): ?>
                        <tr>
                            <td><?= $fila['id_factura'] ?></td>
                            <td><?= $fila['fecha'] ?></td>
                            <td><?= htmlspecialchars($fila['nombre_cliente']) ?></td>
                            <td><?= htmlspecialchars($fila['ci_nit']) ?></td>
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
