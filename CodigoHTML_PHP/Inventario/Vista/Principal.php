<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Inventario</title>
  <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
  <nav class="navbar">
    <img src="img/logo.jpg" class="logo" alt="Logo">
    <a href="../carrito/Vista/carrito.html" class="cart-icon">
      <img src="img/Carrito.png" alt="Carrito">
    </a>
  </nav>

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
        <!-- Más filas si querés -->
      </tbody>
    </table>

    <div class="botones">
      <button>Agregar Producto</button>
    </div>
  </main>
</body>
</html>
