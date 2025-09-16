<?php
require_once '../controlador/historial_venta.php';
require_once '../controlador/historial_producto.php';
require_once '../controlador/historial_inventario.php';

$periodo = $_GET['periodo'] ?? 'semana'; // Recibe semana, mes, año

$ventas = reporteVenta($periodo);
$productos = reporteProducto($periodo);

// Calcular total ganado
$totalGanado = 0;
foreach ($ventas as $v) {
    $totalGanado += $v['total'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Historial de Productos</title>
    <link rel="stylesheet" href="css/estilo.css">
    <link rel="stylesheet" href="../../NavBar/Vista/css/estilos.css">
    <script src="../../NavBar/Vista/javaScript/script.js"></script>
    <link rel="stylesheet" href="../../../assets/css/titulo.css">
    <link rel="stylesheet" href="../../../assets/css/estiloTabla.css">

</head>
<body>
    <?php require('../../NavBar/Vista/Principal.php'); ?>
    <h2>Generar Reportes</h2>

    <!-- Sección detalle de ventas -->
    <div class="section" id="seccionVentas">
        <h3>Detalle de Ventas</h3>
        <select id="optionVentas">
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="anio">Año</option>
        </select>
        <button id="btnDetalleVentas">Generar Reporte</button>
        <button id="abrirModalVentas">Generar Reporte Excel</button>
        <div class="resultado" id="resultadoVentas" style="display:none;"></div>
    </div>

    <!-- Sección detalle de producto -->
    <div class="section" id="seccionStock">
        <h3>Detalle de Producto</h3>
        <select id="optionStock">
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="anio">Año</option>
        </select>
        <button id="btnDetalleStock">Generar Reporte</button>
        <button id="abrirModalProducto">Generar Reporte Excel</button>
        <div class="resultado" id="resultadoStock" style="display:none;"></div>
    </div>

    <!-- Sección detalle de Inventario -->
    <div class="section" id="seccionInventario">
        <h3>Detalle de Inventario</h3>
        <button id="btnDetalleInventario">Generar Reporte</button>
        <button id="abrirModalInventario">Generar Reporte Excel</button>
        <div class="resultado" id="resultadoInventario" style="display:none;"></div>
    </div>

    <!-- Sección del modal -->
    <div id="modalExcel" class="modal">
        <div class= "modal-content">
            <span class="close" id="cerrarModal">&times;</span>
            <h2>✅ Éxito</h2>
            <p>El Reporte se genero exitosamente</p>
            <button class="btn" id="aceptarBtn">Aceptar</button>
        </div>
    </div>
    <script src = "javaScript/botones.js"></script>
    <script src = "javaScript/modal.js"></script>
</body>
</html>