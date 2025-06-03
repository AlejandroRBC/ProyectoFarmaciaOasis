<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Inventario</title>
  <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
  <!-- parte del NavBar -->
  <div class="overlay" id="overlay"></div> <nav class="navbar">
    <img src="img/logo.jpg" class="logo" alt="Logo">
    <a class="cart-icon" onclick="mostrarCarrito()">
      <img src="img/Carrito.png" alt="Carrito">
    </a>
  </nav>


  <!-- CARRITO DE COMPRAS MENU DESPLEGABLE cuidado oe XD  -->
  <div id="MenuCarrito" class="menu-carrito">
    <button class="cerrar-carrito" onclick="mostrarCarrito()">X</button>
    <h2>Carrito de Compras</h2>
    <!-- items de carrito pes chato -->
    <div class="carrito-item">
      <h3>Nombre Producto</h3>
      <p>Laboratorio: <span>(nombre labo)</span></p>
      <p>Cantidad: <span>(numero)</span></p>
      <p class="item-total">Total: <span>(preciototal)</span></p>
      <div class="item-acciones">
        <button class="cantidad-btn">-</button>
        <button class="cantidad-btn">+</button>
        <button class="borrar-btn">Borrar</button>
      </div>
    </div>
    <!-- items de carrito pes chato -->
    <div class="carrito-item">
      <h3>Nombre Producto</h3>
      <p>Laboratorio: <span>(nombre labo)</span></p>
      <p>Cantidad: <span>(numero)</span></p>
      <p class="item-total">Total: <span>(preciototal)</span></p>
      <div class="item-acciones">
        <button class="cantidad-btn">-</button>
        <button class="cantidad-btn">+</button>
        <button class="borrar-btn">Borrar</button>
      </div>
    </div>
    <!-- items de carrito pes chato -->
    <div class="carrito-item">
      <h3>Nombre Producto</h3>
      <p>Laboratorio: <span>(nombre labo)</span></p>
      <p>Cantidad: <span>(numero)</span></p>
      <p class="item-total">Total: <span>(preciototal)</span></p>
      <div class="item-acciones">
        <button class="cantidad-btn">-</button>
        <button class="cantidad-btn">+</button>
        <button class="borrar-btn">Borrar</button>
      </div>
    </div>
    <!-- items de carrito pes chato -->
    <div class="carrito-item">
      <h3>Nombre Producto</h3>
      <p>Laboratorio: <span>(nombre labo)</span></p>
      <p>Cantidad: <span>(numero)</span></p>
      <p class="item-total">Total: <span>(preciototal)</span></p>
      <div class="item-acciones">
        <button class="cantidad-btn">-</button>
        <button class="cantidad-btn">+</button>
        <button class="borrar-btn">Borrar</button>
      </div>
    </div>
    <!-- items de carrito pes chato -->
    <div class="carrito-item">
      <h3>Nombre Producto</h3>
      <p>Laboratorio: <span>(nombre labo)</span></p>
      <p>Cantidad: <span>(numero)</span></p>
      <p class="item-total">Total: <span>(preciototal)</span></p>
      <div class="item-acciones">
        <button class="cantidad-btn">-</button>
        <button class="cantidad-btn">+</button>
        <button class="borrar-btn">Borrar</button>
      </div>
    </div>
    <button>Realizar Compra</button>
</div>

  <main>
    <h1>INVENTARIO</h1>
    <div class="busqueda-container">
      <input type="text" placeholder="¿Qué estás buscando?" class="busqueda">
      <img src="img/lupa.png" alt="Buscar" class="lupa-icon">
    </div>

    <table>
      <thead>
        <tr>
          <th>CÓDIGO</th>
          <th>NOMBRE</th>
          <th>TIPO</th>
          <th>GRAMOS</th>
          <th>PRECIO</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>001</td>
          <td>ibuprofeno</td>
          <td>hi</td>
          <td>500</td>
          <td>15 Bs</td>
          <td>
            <img src="img/CarritoA.png" alt="Agregar al carrito" class="icono">
          </td>
          <td>
            <button>Modificar</button>
            <button>Eliminar</button>
          </td>
        </tr>
        <tr>
          <td>002</td>
          <td>Paracetamol</td>
          <td>he</td>
          <td>250</td>
          <td>20 Bs</td>
          <td>
            <img src="img/CarritoA.png" alt="Agregar al carrito" class="icono">
          </td>
          <td>
            <button>Modificar</button>
            <button>Eliminar</button>
          </td>
        </tr>
        </tbody>
    </table>

    <div class="botones">
      <button>Agregar Producto</button>
    </div>
  </main>

  <script>
    function mostrarCarrito() {
      const menu = document.getElementById('MenuCarrito');
      const overlay = document.getElementById('overlay');

      menu.classList.toggle('activo'); // Alterna la clase 'activo'
      overlay.classList.toggle('activo'); // Alterna la clase 'activo' para el overlay
    }
  </script>
</body>
</html>