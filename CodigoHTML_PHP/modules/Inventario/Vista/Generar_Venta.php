<?php
session_start();
require_once '../Controlador/Venta.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre_cliente'];
    $ci = $_POST['ci_nit'];
    $metodo_pago = $_POST['metodo_pago'] ?? '';
    $fecha = date('Y-m-d');// 
    $hora = date('H:i:s'); // Hora actual al cerrar la venta

    // Insertar cliente y obtener su id
    $conn->query("INSERT INTO CLIENTE (nombre, ci_nit, metodo_pago) VALUES ('$nombre', '$ci', '$metodo_pago')");
    $id_cliente = $conn->insert_id;

    // Obtener la venta abierta actual
    $venta = obtenerVentaAbierta();

    // Cerrar la venta asociando cliente y hora
    
    $conn->query("UPDATE VENTA 
                        SET id_cliente = $id_cliente, 
                            estado = 'CERRADA', 
                            fecha = '$fecha',
                            hora = '$hora'
                        WHERE id_venta = $venta");

    // Guardar ID de venta en sesión
    $_SESSION['venta'] = $venta;

    header("Location: generar_venta.php");
    exit();
}

// Obtener el ID de la venta y asegurarnos que sea entero
$id_venta = intval($_SESSION['venta']);

if (!$conn) {
    die("Error de conexión a la base de datos.");
}

// Obtener datos de la venta y cliente, incluyendo método de pago desde CLIENTE
$sql = "SELECT V.id_venta, V.fecha, V.hora, C.nombre, C.ci_nit, C.metodo_pago
        FROM VENTA V 
        INNER JOIN CLIENTE C ON V.id_cliente = C.id_cliente 
        WHERE V.id_venta = $id_venta";

$res = $conn->query($sql);
if (!$res || $res->num_rows === 0) {
    die("Venta no encontrada.");
}
$venta = $res->fetch_assoc();

// Obtener detalles de productos de la venta
$sql_detalles = "
    SELECT P.nom_prod AS producto,
        P.complemento,
        DV.cantidad,
        (DV.subtotal / DV.cantidad) AS precio_unitario, 
        DV.subtotal
    FROM DETALLEVENTA DV
    JOIN PRODUCTO P ON DV.id_producto = P.id_producto
    WHERE DV.id_venta = $id_venta
";
$detalles = $conn->query($sql_detalles);
if (!$detalles) die("Error al obtener detalles: " . $conn->error);

// Guardamos los detalles en un array
$datosProductos = [];
while ($row = $detalles->fetch_assoc()) {
    $datosProductos[] = $row;
}

// --- GENERAR PDF ---
require_once '../tcpdf/tcpdf.php';

$pdf = new TCPDF('P', 'mm', 'A5');
$pdf->SetMargins(10, 10, 10);
$pdf->AddPage();
$colorAzul = [13, 71, 161];
$pdf->SetFont('helvetica', '', 10);

// Título principal
$pdf->SetFont('', 'B', 16);
$pdf->SetTextColor(...$colorAzul);
$pdf->Cell(0, 12, 'Reporte de Venta', 0, 1, 'C');
$pdf->SetTextColor(0, 0, 0);

// Columnas izquierda (emisor) y derecha (cliente)
$xInicio = 15; 
$yInicio = $pdf->GetY() + 5; 
$anchoCol = ($pdf->getPageWidth() - 30) / 2;

// Emisor
$pdf->SetFont('', 'B', 11);
$pdf->SetXY($xInicio, $yInicio);
$pdf->Cell($anchoCol, 7, 'Datos Emisor', 0, 1);
$pdf->SetFont('', '', 10);
$pdf->SetXY($xInicio, $pdf->GetY());
$pdf->MultiCell($anchoCol, 6,
    "Nombre: FARMACIA OASIS\nNIT: 00000000\nDirección: NOSEWEON\nTeléfono: 0000",
    0, 'L', false, 1, $xInicio, $pdf->GetY()
);

// Cliente
$pdf->SetFont('', 'B', 11);
$pdf->SetXY($xInicio + $anchoCol + 10, $yInicio);
$pdf->Cell($anchoCol, 7, 'Datos Cliente', 0, 1);
$pdf->SetFont('', '', 10);
$pdf->SetXY($xInicio + $anchoCol + 10, $pdf->GetY());
$pdf->MultiCell($anchoCol, 6,
    "Nombre: " . $venta['nombre'] . "\n" .
    "NIT/CI: " . $venta['ci_nit'] . "\n" .
    "Hora: " . $venta['hora'] . "\n" .
    "Método Pago: " . ucfirst($venta['metodo_pago']),
    0, 'L', false, 1, $xInicio + $anchoCol + 10, $pdf->GetY()
);

$yDespuesDatos = max($pdf->GetY(), $yInicio + 40);
$pdf->SetXY($xInicio, $yDespuesDatos + 5);

// Datos de venta
$xInicioDatos = 15;
$pdf->SetX($xInicioDatos);
$pdf->SetFont('', 'B', 11);
$pdf->Cell(40, 7, "Venta Nº:", 0, 0, 'L');
$pdf->SetFont('', '', 11);
$pdf->Cell(50, 7, $venta['id_venta'], 0, 1, 'L');

$pdf->SetX($xInicioDatos);
$pdf->SetFont('', 'B', 11);
$pdf->Cell(40, 7, "Fecha:", 0, 0, 'L');
$pdf->SetFont('', '', 11);
$pdf->Cell(50, 7, $venta['fecha'], 0, 1, 'L');

$pdf->Ln(8);

// Tabla de productos
$wCant = 15;
$wDesc = 25;
$wComp = 30;
$wPU = 30;
$wSub = 28;
$xTabla = $xInicio;
$pdf->SetX($xTabla);

// Encabezado
$pdf->SetFillColor(...$colorAzul);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('', 'B', 10);
$pdf->Cell($wCant, 8, 'Cant.', 1, 0, 'C', 1);
$pdf->Cell($wDesc, 8, 'Descripción', 1, 0, 'C', 1); 

$pdf->Cell($wComp, 8, 'Complemento', 1, 0, 'C', 1); 

$pdf->Cell($wPU, 8, 'Precio Unit.', 1, 0, 'C', 1);
$pdf->Cell($wSub, 8, 'Subtotal', 1, 1, 'C', 1);

// Filas
$pdf->SetFillColor(240, 240, 240);
$pdf->SetTextColor(0, 0, 0);
$pdf->SetFont('', '', 10);
$fill = 0; $total = 0;

foreach ($datosProductos as $row) {
    $total += $row['subtotal'];
    $pdf->SetX($xTabla);
    $pdf->Cell($wCant, 7, $row['cantidad'], 'LR', 0, 'C', $fill);
    $pdf->Cell($wDesc, 7, $row['producto'], 'LR', 0, 'L', $fill);
    $pdf->Cell($wComp, 7, $row['complemento'], 'LR', 0, 'LR', $fill);
    $pdf->Cell($wPU, 7, 'Bs. ' . number_format($row['precio_unitario'], 2), 'LR', 0, 'R', $fill);
    $pdf->Cell($wSub, 7, 'Bs. ' . number_format($row['subtotal'], 2), 'LR', 1, 'R', $fill);
    $fill = !$fill;
}

$pdf->SetX($xTabla);
$pdf->Cell(array_sum([$wCant,$wDesc,$wPU,$wSub]), 0, '', 'T');
$pdf->Ln(5);

// Totales
$pdf->SetX($xTabla);
$pdf->SetFont('', 'B', 14);
$pdf->Cell($wCant + $wDesc + $wPU, 10, 'Total', 0, 0, 'R');
$pdf->SetTextColor(...$colorAzul);
$pdf->Cell($wSub, 10, 'Bs. ' . number_format($total, 2), 0, 1, 'R');
$pdf->SetTextColor(0, 0, 0);

// Guardar PDF
$nombreArchivo = "Venta_" . $venta['id_venta'] . ".pdf";
$rutaEscritorio = "C:\\Ventas";
if (!file_exists($rutaEscritorio)) mkdir($rutaEscritorio, 0777, true);
$rutaPDF = realpath($rutaEscritorio) . DIRECTORY_SEPARATOR . $nombreArchivo;
$pdf->Output($rutaPDF, 'F');
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Venta</title>
    <link rel="stylesheet" href="css/venta.css">
</head>
<body style="background-color: #f8f9fa; padding: 20px;">
    <div class="venta-container">
        <h3 class="titulo-venta">Venta Nº <?= htmlspecialchars($venta['id_venta']) ?></h3>
        <div class="venta-datos">
            <p>
                <strong>Cliente:</strong> <?= htmlspecialchars($venta['nombre']) ?><br>
                <strong>CI/NIT:</strong> <?= htmlspecialchars($venta['ci_nit']) ?><br>
                <strong>Fecha:</strong> <?= htmlspecialchars($venta['fecha']) ?><br>
                <strong>Hora:</strong> <?= htmlspecialchars($venta['hora']) ?><br>
                <strong>Método de Pago:</strong> <?= htmlspecialchars($venta['metodo_pago']) ?>
            </p>
        </div>

        <!-- Tabla de productos -->
        <table class="tabla-venta">
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

        <div class="venta-mensaje">
            <a href="../../Inventario/Vista/principal.php" class="btn-inicio">
                <img src="../Vista/img/iconCasa.png" alt="Inicio" style="width: 30px; height: 30px;">
            </a>
        </div>
    </div>
</body>
</html>
