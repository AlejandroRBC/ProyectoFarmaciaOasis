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

require_once '../tcpdf/tcpdf.php';

$pdf = new TCPDF('P', 'mm', 'A5');
$pdf->SetMargins(10, 10, 10);
$pdf->AddPage();

// Definir color azul para encabezados
$colorAzul = [13, 71, 161];

// Fuente general
$pdf->SetFont('helvetica', '', 10);

// Título principal centrado
$pdf->SetFont('', 'B', 16);
$pdf->SetTextColor(...$colorAzul);
$pdf->Cell(0, 12, 'Factura Electrónica', 0, 1, 'C');

// Restaurar color negro para contenido
$pdf->SetTextColor(0, 0, 0);

// Definir márgenes y anchos
$xInicio = 15; 
$yInicio = $pdf->GetY() + 5; 
$anchoCol = ($pdf->getPageWidth() - 30) / 2; 

// --- Columna izquierda: Datos Emisor ---
$pdf->SetFont('', 'B', 11);
$pdf->SetXY($xInicio, $yInicio);
$pdf->Cell($anchoCol, 7, 'Datos Emisor', 0, 1);

$pdf->SetFont('', '', 10);
$pdf->SetXY($xInicio, $pdf->GetY());
$pdf->MultiCell(
    $anchoCol, 6,
    "Nombre: FARMACIA OASIS\nNIT: 00000000\nDirección: NOSEWEON\nTeléfono: 0000",
    0, 'L', false,
    1,
    $xInicio,
    $pdf->GetY()
);

// --- Columna derecha: Datos Cliente ---
$pdf->SetFont('', 'B', 11);
$pdf->SetXY($xInicio + $anchoCol + 10, $yInicio); 
$pdf->Cell($anchoCol, 7, 'Datos Cliente', 0, 1);

$pdf->SetFont('', '', 10);
$pdf->SetXY($xInicio + $anchoCol + 10, $pdf->GetY());
$pdf->MultiCell(
    $anchoCol, 6,
    "Nombre: " . $factura['nombre'] . "\n" .
    "NIT/CI: " . $factura['ci_nit'] ,
    0, 'L', false,
    1,
    $xInicio + $anchoCol + 10,
    $pdf->GetY()
);

// Ajustar Y para continuar debajo de la sección datos
$yDespuesDatos = max(
    $pdf->GetY(),
    $yInicio + 40 
);

$pdf->SetXY($xInicio, $yDespuesDatos + 5);

// --- Datos Factura ---
// Definir un X fijo para empezar
$xInicioDatos = 15;
$pdf->SetX($xInicioDatos);

// Factura Nº
$pdf->SetFont('', 'B', 11);
$pdf->Cell(40, 7, "Factura Nº:", 0, 0, 'L'); 
$pdf->SetFont('', '', 11);
$pdf->Cell(50, 7, $factura['id_factura'], 0, 1, 'L'); 

// Fecha
$pdf->SetX($xInicioDatos);
$pdf->SetFont('', 'B', 11);
$pdf->Cell(40, 7, "Fecha:", 0, 0, 'L');
$pdf->SetFont('', '', 11);
$pdf->Cell(50, 7, $factura['fecha'], 0, 1, 'L');

$pdf->Ln(8);

// --- Tabla productos ---

// Anchos ajustados 
$wCant = 15;  // Cantidad más estrecha
$wDesc = 55;  // Descripción más ancha
$wPU   = 30;  // Precio Unitario estrecho
$wSub  = 28;  // Subtotal

// Posición inicial tabla (igual que antes)
$xTabla = $xInicio;
$pdf->SetX($xTabla);

// Encabezados
$pdf->SetFillColor(...$colorAzul);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('', 'B', 10);

$pdf->Cell($wCant, 8, 'Cant.', 1, 0, 'C', 1);
$pdf->Cell($wDesc, 8, 'Descripción', 1, 0, 'C', 1);
$pdf->Cell($wPU, 8, 'Precio Unit.', 1, 0, 'C', 1);
$pdf->Cell($wSub, 8, 'Subtotal', 1, 1, 'C', 1);

// Filas
$pdf->SetFillColor(240, 240, 240);
$pdf->SetTextColor(0, 0, 0);
$pdf->SetFont('', '', 10);

$fill = 0;
$total = 0;

foreach ($datosProductos as $row) {
    $total += $row['subtotal'];

    $pdf->SetX($xTabla);
    $pdf->Cell($wCant, 7, $row['cantidad'], 'LR', 0, 'C', $fill);
    $pdf->Cell($wDesc, 7, $row['producto'], 'LR', 0, 'L', $fill);
    $pdf->Cell($wPU, 7, 'Bs. ' . number_format($row['precio_unitario'], 2), 'LR', 0, 'R', $fill);
    $pdf->Cell($wSub, 7, 'Bs. ' . number_format($row['subtotal'], 2), 'LR', 1, 'R', $fill);

    $fill = !$fill;
}

$pdf->SetX($xTabla);
$pdf->Cell(array_sum([$wCant, $wDesc, $wPU, $wSub]), 0, '', 'T');

$pdf->Ln(5);

// Totales
$pdf->SetX($xTabla);
// $iva = $total * 0.13;     // Eliminado
// $totalConIva = $total + $iva;  // Eliminado
$pdf->SetX($xTabla);
$pdf->SetFont('', 'B', 14);
$pdf->Cell($wCant + $wDesc + $wPU, 10, 'Total', 0, 0, 'R');
$pdf->SetTextColor(...$colorAzul);
$pdf->Cell($wSub, 10, 'Bs. ' . number_format($total, 2), 0, 1, 'R'); 
$pdf->SetTextColor(0, 0, 0);

$pdf->Ln(10);
// Mensaje final 
$pdf->SetFont('', 'I', 9);
$pdf->Cell(0, 6, 'Gracias por su compra', 0, 1, 'C');
$pdf->Cell(0, 6, 'Factura electrónica con validez legal', 0, 1, 'C');

// --- Guardar PDF ---
$nombreArchivo = "Factura_" . $factura['id_factura'] . ".pdf";
$rutaEscritorio = "C:\\Users\\VictorAlbertoMachaca\\Desktop\\Facturas";

if (!file_exists($rutaEscritorio)) {
    mkdir($rutaEscritorio, 0777, true);
}
$carpeta = realpath($rutaEscritorio);
if ($carpeta === false) {
    die("Error: no se pudo acceder o crear la carpeta de facturas.");
}
$rutaPDF = $carpeta . DIRECTORY_SEPARATOR . $nombreArchivo;

$pdf->Output($rutaPDF, 'F');

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Factura</title>
    <link rel="stylesheet" href="css/estilos.css" />
</head>
    <body style="background-color: #f8f9fa; padding: 20px;">

        <div class="factura-container">

            <h3 class="titulo-factura">Factura Nº <?= htmlspecialchars($factura['id_factura']) ?></h3>

            <div class="factura-datos">
                <p>
                    <strong>Cliente:</strong> <?= htmlspecialchars($factura['nombre']) ?><br>
                    <strong>CI/NIT:</strong> <?= htmlspecialchars($factura['ci_nit']) ?><br>
                    <strong>Fecha:</strong> <?= htmlspecialchars($factura['fecha']) ?>
                </p>
            </div>

            <!-- Tabla de productos -->
            <table class="tabla-factura">
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
                    <tr class="fw-bold">
                        <td colspan="3" style="text-align:right;">Total</td>
                        <td><?= number_format($totalTabla, 2) ?></td>
                    </tr>
                </tbody>
            </table>

            <!-- Mensaje final -->
            <div class="factura-mensaje">
                <!-- <h2>La Factura se guardo... !</h2>-->
                <a href="../../Inicio/Vista/principal.php" class="btn-inicio">
                <img src="../Vista/img/iconCasa.png" alt="Inicio" style="width: 30px; height: 30px;">
                </a>
            </div>
        </div>

    </body>
</html>




