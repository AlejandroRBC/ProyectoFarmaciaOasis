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

// Obtener el ID de la factura y asegurarnos que sea entero
$id_factura = intval($_SESSION['factura']);

if (!$conn) {
    die("Error de conexión a la base de datos.");
}

// Obtener datos de la factura y cliente
$sql = "SELECT F.id_factura, F.fecha, C.nombre, C.ci_nit FROM FACTURA F INNER JOIN CLIENTE C ON F.id_cliente = C.id_cliente WHERE F.id_factura = $id_factura";

$res = $conn->query($sql);
if (!$res || $res->num_rows === 0) {
    die("Factura no encontrada.");
}
$factura = $res->fetch_assoc();

// Obtener detalles de productos de la factura
$sql_detalles = "
    SELECT P.nom_prod AS producto, DV.cantidad, (DV.subtotal / DV.cantidad) AS precio_unitario, DV.subtotal
    FROM detalleventa DV
    JOIN producto P ON DV.id_producto = P.id_producto
    WHERE DV.id_factura = $id_factura
";
$detalles = $conn->query($sql_detalles);
if (!$detalles) {
    die("Error al obtener detalles: " . $conn->error);
}

// Guardamos los detalles en un array para poder usarlos más de una vez (evita recorrer el resultado dos veces)
$datosProductos = [];
while ($row = $detalles->fetch_assoc()) {
    $datosProductos[] = $row;
}

// *** GENERAR PDF CON TCPDF ***

// Inicializar TCPDF
require_once '../tcpdf/tcpdf.php';
$pdf = new TCPDF();
$pdf->AddPage();
$pdf->SetFont('helvetica', '', 10);

// Título de la factura en el PDF
$pdf->SetFont('', 'B', 14);
$pdf->Cell(0, 10, "Factura Nº " . $factura['id_factura'], 0, 1, 'C');

// Datos cliente en el PDF
$pdf->SetFont('', '', 10);
$pdf->Ln(4);
$pdf->Cell(0, 6, "Cliente: " . $factura['nombre'], 0, 1);
$pdf->Cell(0, 6, "CI/NIT: " . $factura['ci_nit'], 0, 1);
$pdf->Cell(0, 6, "Fecha: " . $factura['fecha'], 0, 1);
$pdf->Ln(5);

// Construir tabla HTML para el PDF
$html = '<table border="1" cellpadding="4">
    <thead>
        <tr>
            <th><b>Producto</b></th>
            <th><b>Cantidad</b></th>
            <th><b>Precio Unitario</b></th>
            <th><b>Subtotal</b></th>
        </tr>
    </thead>
    <tbody>';

$total = 0;
foreach ($datosProductos as $row) {
    $total += $row['subtotal'];
    $html .= '<tr>
        <td>' . htmlspecialchars($row['producto']) . '</td>
        <td>' . $row['cantidad'] . '</td>
        <td>' . number_format($row['precio_unitario'], 2) . '</td>
        <td>' . number_format($row['subtotal'], 2) . '</td>
    </tr>';
}

$html .= '<tr>
    <td colspan="3" align="right"><b>Total</b></td>
    <td><b>' . number_format($total, 2) . '</b></td>
</tr>';

$html .= '</tbody></table>';

// Escribir tabla en PDF
$pdf->writeHTML($html, true, false, false, false, '');

// Guardar PDF en carpeta 'facturas'
$nombreArchivo = "Factura_" . $factura['id_factura'] . ".pdf";

//Necesario crear carpeta en el escritorio que vas a usar
$rutaEscritorio = "C:\Users\Administrador\Desktop\Facturas";
//$carpetaRelativa = 'C:/facturas/'; directo al C borrar el comentario si es necesario
$carpetaRelativa = $rutaEscritorio;

// Crear carpeta si no existe
if (!file_exists($carpetaRelativa)) {
    mkdir($carpetaRelativa, 0777, true);
}

$carpeta = realpath($carpetaRelativa);
if ($carpeta === false) {
    die("Error: no se pudo acceder o crear la carpeta de facturas.");
}

$rutaPDF = $carpeta . DIRECTORY_SEPARATOR . $nombreArchivo;
$pdf->Output($rutaPDF, 'F');

// Mostrar mensaje con enlace al PDF
// echo "Factura guardada exitosamente: <a href='../$carpetaRelativa/$nombreArchivo' target='_blank'>Ver PDF</a>";

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vista Factura</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body class="p-3">

<h5>Factura Nº <?= htmlspecialchars($factura['id_factura']) ?></h5>
<p>
    <strong>Cliente:</strong> <?= htmlspecialchars($factura['nombre']) ?><br />
    <strong>CI/NIT:</strong> <?= htmlspecialchars($factura['ci_nit']) ?><br />
    <strong>Fecha:</strong> <?= htmlspecialchars($factura['fecha']) ?>
</p>
<!-- Tabla visible en la página -->
<table class="table table-bordered table-dark table-sm">
    <thead>
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $totalTabla = 0;
        foreach ($datosProductos as $row):
            $totalTabla += $row['subtotal'];
        ?>
        <tr>
            <td><?= htmlspecialchars($row['producto']) ?></td>
            <td><?= $row['cantidad'] ?></td>
            <td><?= number_format($row['precio_unitario'], 2) ?></td>
            <td><?= number_format($row['subtotal'], 2) ?></td>
        </tr>
        <?php endforeach; ?>
        <tr>
            <td colspan="3" class="text-right"><strong>Total</strong></td>
            <td><strong><?= number_format($totalTabla, 2) ?></strong></td>
        </tr>
    </tbody>
</table>
</body>
</html>




