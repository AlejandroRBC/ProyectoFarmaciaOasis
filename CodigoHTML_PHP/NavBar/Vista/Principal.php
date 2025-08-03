<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navbar con Menú Desplegable</title>
    <link rel="stylesheet" href="css/estilos.css">
</head>
<body>

<nav class="navbar">
    <img src="img/logo.jpg" class="logo" alt="Logo">
    <div class="menu"><span id="menuToggle"> menu</span></div>
</nav>

<div class="overlay-menu" id="overlayMenu">
    <button class="close-btn1" id="closeMenu">&times;</button> <div class="overlay-menu-list">
        <a href="../../Inicio/Vista/principal.php"><i>Inicio</i></a>
        <a href="../../Inventario/Vista/principal.php"><i>Inventario</i></a>
    </div>
</div>
<script src="javaScript/script.js"></script> </body>
</html>