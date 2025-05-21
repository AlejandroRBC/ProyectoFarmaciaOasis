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
  <main>
    <?php
        $images = [
            ["img" => "img/alikal.png", "text" => "Ahora Bs 1.50 <br>Alikal 1X100 UND"],
            ["img" => "img/aspirina.png", "text" => "Ahora Bs 0.80 <br>Aspirina 1 TabletaX100 UND"],
            ["img" => "img/azitromicina.png", "text" => "Ahora Bs 3.40 <br>Azitromicina 1 TabletaX100 UND"],
            ["img" => "img/bloqueadorSol.png", "text" => "Ahora Bs 7.10 <br>Bloquador Solar Bahia 1X100 UND"],
            ["img" => "img/condonesP.png", "text" => "Ahora Bs 12.00 <br>Condones Prudence Original 1X100 UND"],
            ["img" => "img/ibuprofeno.png", "text" => "Ahora Bs 2.50 <br>Ibuprofeno 1 TabletaX100 UND"],
            ["img" => "img/paracetamol.png", "text" => "Ahora Bs 1.80 <br>Paracetamol 1 TabletaX100 UND"],
            ["img" => "img/prEmbarazo.png", "text" => "Ahora Bs 25.30 <br>Prueba de Embarazo 1X100 UND"],
            ["img" => "img/tapsinDia.png", "text" => "Ahora Bs 3.59 <br>Tapsin Dia 1X100 UND"]
        ];
    ?>
    <div class="boton">
        <a href="../../Inventario/Vista/Principal.php" class="btn">Inventario</a>
    </div>
   <div class="grid-container">
    <?php for ($i = 0; $i < count($images); $i++): ?>
        <div class="grid-image">
            <img src="<?php echo $images[$i]['img']; ?>" alt="Imagen">
            <p><?php echo $images[$i]['text']; ?></p>
        </div>
    <?php endfor; ?>
    </div>
  </main>
</body>
</html>
