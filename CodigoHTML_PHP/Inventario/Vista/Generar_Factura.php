<?php
session_start();
require_once '../Modelo/codigo.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre_cliente'];
    $ci = $_POST['ci_nit'];

    // Insertar cliente y obtener su id
    $conn->query("INSERT INTO CLIENTE (nombre, ci_nit) VALUES ('$nombre', '$ci')");
    $id_cliente = $conn->insert_id;

    // Obtener la factura abierta actual
    $factura = obtenerFacturaAbierta();

    // Cerrar la factura asociando el cliente
    $conn->query("UPDATE FACTURA SET id_cliente = $id_cliente, estado = 'CERRADA' WHERE id_factura = $factura");

    // Guardar ID de factura en sesión
    $_SESSION['factura'] = $factura;

    // Redirigir a la página donde mostrarás la factura
    header("Location: Generar_Factura.php");
    exit();
}
?>

<?php
//Ver si esta sustrayendo el id correctamente
    $factura = $_SESSION['factura'];
    echo "<p>Hola, acá tengo la factura generada. ID: <strong>$factura</strong></p>";
?>





