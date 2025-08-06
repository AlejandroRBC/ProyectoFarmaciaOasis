<?php
// Obtener la fecha actual
date_default_timezone_set('America/La_Paz');
// Datos de conexión
$host = "localhost";
$usuario = "root";
$contraseña = ""; // cambiar si tu MySQL tiene contraseña
$base_datos = "proyecto farmacia";

// Crear conexión
$conn = new mysqli($host, $usuario, $contraseña, $base_datos);

// Verificar conexión
if ($conn->connect_error) {
    die(" Conexión fallida: " . $conn->connect_error);
}

?>
