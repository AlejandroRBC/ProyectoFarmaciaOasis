<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Inicio</title>
  <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
  <nav class="navbar">
    <img src="img/logo.jpg" class="logo" alt="Logo">
  </nav>

  
  


  <div class="head-container">
    <center>
    <img src="img/logo.jpg" class="logo" style="height: 130px;">
    </center>
    <!-- fecah y hora con JS -->
    <div  class="inventario">
      <div id="fecha"></div>
      <div id="hora"></div>
      <!-- logo de inventarioa para boton -->
      <div>
        <a href="../../Inventario/Vista/principal.php">
          <img src="img/inventarioIcono.png" style="height: 100px;">
        </a>
      </div>
    </div>
  </div>

  <div class="Buscador">
      <input type="search" placeholder="Buscar producto..." aria-label="Buscar" />
      <button type="submit">Buscar</button>
  </div>

  <!-- Graficos Circulares -->
<div class="containerCirculos">
  <div class="circulo" style="background-color: #034C8C;" >
    <span class="msgGrande"><h1>420 bs</h1></span>
    <span class="msgPeque"><h3>total de Hoy</h3></span>
  </div>
  <div class="circulo" style="background-color: #04BFBF;">
    <span class="msgGrande"><h1>30</h1></span>
    <span class="msgPeque"><h3>Nro. Productos Vendidos</h3></span>
  </div>
  <div class="circulo" style="background-color: #ABB4B2;">
    <span class="msgGrande"><h1>20</h1></span>
    <span class="msgPeque"><h3>total de ventas</h3></span>
  </div>
</div>

<!-- fin de circulos -->
<!-- Botones -->
<div class="botones">
  <button onclick="mostrarModal('modalBajos')">Productos por Acabarse</button>
  <button onclick="mostrarModal('modalVencer')">Productos por Vencer</button>
  <br><br>
  <button>Actualizar Información</button>
  <button>Generar Reporte del Día</button>
</div>

<!-- MODAL PARA PRODUCTOS BAJOS -->
<div id="modalBajos" class="modal" style="display:none;">
  <div class="modal-contenido">
    <span class="cerrar" onclick="cerrarModal('modalBajos')">&times;</span>
    <h3>Productos por Acabarse</h3>
    <table>
      <thead>
        <tr>
          <th>NOMBRE</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Ibuprofeno</td><td>15</td></tr>
        <tr><td>Clonazepam</td><td>2</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- MODAL PARA PRODUCTOS POR VENCER -->
<div id="modalVencer" class="modal" style="display:none;">
  <div class="modal-contenido">
    <span class="cerrar" onclick="cerrarModal('modalVencer')">&times;</span>
    <h3>Productos por Vencer</h3>
    <table>
      <thead>
        <tr>
          <th>NOMBRE</th>
          <th>Fecha Vencimiento</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Ibuprofeno</td><td>2027/04/13</td></tr>
        <tr><td>Clonazepam</td><td>2026/08/03</td></tr>
      </tbody>
    </table>
  </div>
</div>




<!-- links de JS -->
<script src="javaScript/fechaHora.js"></script>
<script src="javaScript/abrirModal.js"></script>
</body>
</html>
