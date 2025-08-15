
<?php require_once '../Controlador/actualizarTotal.php';?>
<?php require_once '../Controlador/actualizarNroProds.php';?>
<?php require_once '../Controlador/actualizarNroVentasProds.php';?>
<?php require_once '../Controlador/productosBajos.php';?>
<?php require_once '../Controlador/productosPorVencer.php';?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Inicio</title>
  <link rel="stylesheet" href="css/buscador.css">
  <link rel="stylesheet" href="css/circulos.css">
  <link rel="stylesheet" href="css/estilos.css">
  <link rel="stylesheet" href="css/modal.css">
  <link rel="stylesheet" href="css/tablaProds.css">
  <link rel="stylesheet" href="css/botones.css">
</head>
<body>
  <!-- Llamar al navbar -->
  <script src="../../NavBar/Vista/javaScript/script.js"></script>
  <link rel="stylesheet" href="../../NavBar/Vista/css/estilos.css">
  <?php 
  require('../../NavBar/Vista/Principal.php');
  ?>
  <!-- Fin de la llamada de Navbar -->

<div class="head-container">
  <img src="img/logo.jpg" class="logo2" style="height: 130px;">
  <div class="fecha-hora-container">
    <div id="fecha"></div>
    <div id="hora"></div>
  </div>
</div>
<!-- 
  PARA VER SI ESTO BUSCA EL PRODUCTO EN LA PAGINA INICIO, pero para futuro XD
  <div class="Buscador">
      <input type="search" placeholder="Buscar producto..." aria-label="Buscar" />
      <button type="submit">Buscar</button>
  </div>
-->

  <!-- Graficos Circulares -->
<div class="containerCirculos">
  
<div div class="circulo" style="background-color: #034C8C;">
    <span class="msgGrande"><h1><?php echo number_format($totalHoy, 2); ?> bs</h1></span>
    <span class="msgPeque"><h3>total de Hoy</h3></span>
</div>

<div class="circulo" style="background-color: #04BFBF;">
    <span class="msgGrande"><h1><?php echo $total_productos; ?></h1></span>
    <span class="msgPeque"><h3>Nro. Productos Vendidos</h3></span>
</div>

<div class="circulo" style="background-color: #ABB4B2;">
    <span class="msgGrande"><h1><?= $total_ventas ?></h1></span>
    <span class="msgPeque"><h3>Ventas Hoy</h3></span>
</div>
</div>

<!-- fin de circulos -->
<!-- Botones -->
<div class="botones">
  <button onclick="mostrarModal('modalBajos')">Productos por Acabarse</button>
  <button onclick="mostrarModal('modalVencer')">Productos por Vencer</button>
</div>

<!-- MODAL PARA PRODUCTOS BAJOS -->
<div id="modalBajos" class="modal" style="display:none;">
  <div class="modal-contenido">
    <span class="cerrar" onclick="cerrarModal('modalBajos')">&times;</span>
    <h3>Productos por Acabarse (Stock ≤ <?= $referencia_Bajo ?>)</h3>
    <table>
      <thead>
        <tr>
          <th>NOMBRE</th>
          <th>STOCK</th>
          <th>ESTADO</th>
          <th>LABORATORIO</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($productos_bajos as $producto): ?>
          <tr class="<?= $producto['stock'] <= 5 ? 'stock-critico' : 'stock-bajo' ?>">
            <td><?= htmlspecialchars($producto['nom_prod']) ?></td>
            <td><?= $producto['stock'] ?></td>
            <td><?= $producto['stock'] <= 5 ? 'CRÍTICO' : 'BAJO' ?></td>
            <td><?= $producto['nombre'] ?></td>
          </tr>
        <?php endforeach; ?>
        <?php if (empty($productos_bajos)): ?>
          <tr><td colspan="3">No hay productos con stock bajo</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- MODAL PARA PRODUCTOS POR VENCER -->
<div id="modalVencer" class="modal" style="display:none;">
  <div class="modal-contenido">
    <span class="cerrar" onclick="cerrarModal('modalVencer')">&times;</span>
    <h3>Productos por Vencer (próximos <?= $dias_alerta ?> días)</h3>
    <table>
      <thead>
        <tr>
          <th>NOMBRE</th>
          <th>LABORATORIO</th>
          <th>FECHA VENCIMIENTO</th>
          <th>DÍAS RESTANTES</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($productos_por_vencer as $producto): 
          $fecha_venc = new DateTime($producto['fecha_expiracion']);
          $hoy = new DateTime();
          $dias_restantes = $hoy->diff($fecha_venc)->days;
          $clase_alerta = $dias_restantes <= 15 ? 'alerta-roja' : ($dias_restantes <= 30 ? 'alerta-amarilla' : '');
        ?>
          <tr class="<?= $clase_alerta ?>">
            <td><?= htmlspecialchars($producto['nom_prod']) ?></td>
            <td><?= $producto['nombre'] ?></td>
            <td><?= date('d/m/Y', strtotime($producto['fecha_expiracion'])) ?></td>
            <td><?= $dias_restantes ?> días</td>
          </tr>
        <?php endforeach; ?>
        <?php if (empty($productos_por_vencer)): ?>
          <tr><td colspan="3">No hay productos por vencer en los próximos <?= $dias_alerta ?> días</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php 
  $conn->close();
?>
<!-- links de JS -->
<script src="javaScript/fechaHora.js"></script>
<script src="javaScript/abrirModal.js"></script>
</body>
</html>
