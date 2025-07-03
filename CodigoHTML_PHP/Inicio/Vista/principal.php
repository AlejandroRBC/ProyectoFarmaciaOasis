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
    <a href="../../Carrito/Vista/principal.php" class="cart-icon">
      <img src="img/Carrito.png" alt="Carrito">
    </a>
  </nav>

  <div id="fechaHora">
    <div id="fecha"></div>
    <div id="hora"></div>
  </div>


  <div class="Buscador">
      <input type="search" placeholder="Buscar producto..." aria-label="Buscar" />
      <button type="submit">Buscar</button>
  </div>

  <div class="botones-container">
    <a href="../../Inventario/Vista/Principal.php" class="boton-inicio">
      <img src="img/inventario.png" alt="Inventario">
    </a>
    <a href="#" class="boton-inicio">
      <img src="img/porVencer.png" alt="Por vencer">
    </a>
    <a href="#" class="boton-inicio">
      <img src="img/bajoStock.png" alt="Stock bajo">
      <span>Stock Bajo XDD</span>
    </a>
  </div>
  

  <script src="javaScript/fechaHora.js"></script>
</body>
</html>
