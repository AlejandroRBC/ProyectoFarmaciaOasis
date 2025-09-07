<?php
/**
 * Agrega un producto al carrito (detalle de venta), creando la venta si es necesario.
 * 
 * @param int $id_producto ID del producto
 * @param int $cantidad Cantidad a agregar (por defecto 1)
 * @return array Resultado de la operación
 */
function agregarAlCarrito($id_producto, $cantidad = 1) {
    global $conn;
    $id_venta = obtenerVentaAbierta();

    // Verificar estado de la venta
    $resEstado = $conn->query("SELECT estado FROM VENTA WHERE id_venta = $id_venta");
    if (!$resEstado || $resEstado->num_rows === 0) return ['error'=>'Venta no encontrada'];
    $estado = $resEstado->fetch_assoc()['estado'];
    if ($estado !== 'ABIERTA') return ['error'=>'No se puede modificar la venta cerrada'];

    // Verificar existencia del producto
    $res = $conn->query("SELECT precio_venta, stock FROM PRODUCTO WHERE id_producto = $id_producto");
    if (!$res || $res->num_rows === 0) return ['error'=>'Producto no encontrado'];
    $producto = $res->fetch_assoc();

    $precio_venta = (float)$producto['precio_venta']; 
    $stock_actual = (int)$producto['stock'];

    $res2 = $conn->query("SELECT id_detalle, cantidad FROM DETALLEVENTA WHERE id_venta = $id_venta AND id_producto = $id_producto");

    if ($res2 && $res2->num_rows > 0) {
        $detalle = $res2->fetch_assoc();
        $cantidad_actual = (int)$detalle['cantidad'];
        $nueva_cantidad = $cantidad_actual + $cantidad;
        $diferencia = $nueva_cantidad - $cantidad_actual;

        if ($stock_actual < $diferencia) return ['error'=>'Stock insuficiente'];

        $subtotal = $nueva_cantidad * $precio_venta;
        $conn->query("UPDATE DETALLEVENTA SET cantidad = $nueva_cantidad, subtotal = $subtotal WHERE id_detalle = " . $detalle['id_detalle']);

        $nuevo_stock = $stock_actual - $diferencia;
        $conn->query("UPDATE PRODUCTO SET stock = $nuevo_stock WHERE id_producto = $id_producto");
    } else {
        if ($stock_actual < $cantidad) return ['error'=>'Stock insuficiente'];

        $subtotal = $cantidad * $precio_venta;
        $conn->query("INSERT INTO DETALLEVENTA (id_venta, id_producto, cantidad, subtotal) VALUES ($id_venta, $id_producto, $cantidad, $subtotal)");

        $nuevo_stock = $stock_actual - $cantidad;
        $conn->query("UPDATE PRODUCTO SET stock = $nuevo_stock WHERE id_producto = $id_producto");
    }

    return ['success'=>true, 'id_venta'=>$id_venta];
}


/**
 * Obtiene los productos actuales del carrito (detalle de venta) para la venta abierta.
 * 
 * @return array Lista de productos en el carrito
 */
function obtenerCarrito() {
    global $conn;
    $id_venta = obtenerVentaAbierta();

    $sql = "SELECT d.id_detalle, p.nom_prod, p.complemento, d.cantidad, d.subtotal
            FROM DETALLEVENTA d
            JOIN PRODUCTO p ON d.id_producto = p.id_producto
            WHERE d.id_venta = $id_venta";

    $result = $conn->query($sql);
    $carrito = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $carrito[] = $row;
        }
    }

    return $carrito;
}


/**
 * Elimina un producto específico del carrito y actualiza el stock.
 * 
 * @param int $id_detalle ID del detalle de venta a eliminar
 * @return array Resultado de la operación
 */
function eliminarProductoCarrito($id_detalle) {
    global $conn;

    // Recuperar información del detalle
    $res = $conn->query("SELECT id_venta, id_producto, cantidad FROM DETALLEVENTA WHERE id_detalle = $id_detalle");
    if (!$res || $res->num_rows === 0) return ['error' => 'Detalle no encontrado'];
    $row = $res->fetch_assoc();

    $id_venta = $row['id_venta'];
    $id_producto = $row['id_producto'];
    $cantidad = (int)$row['cantidad'];

    // Verificar estado de la venta
    $resEstado = $conn->query("SELECT estado FROM VENTA WHERE id_venta = $id_venta");
    if (!$resEstado || $resEstado->num_rows === 0) return ['error' => 'Venta no encontrada'];
    $estado = $resEstado->fetch_assoc()['estado'];

    if ($estado !== 'ABIERTA') {
        return ['error' => 'No se puede eliminar producto, la venta está cerrada'];
    }

    // Devolver cantidad al stock
    $conn->query("UPDATE PRODUCTO SET stock = stock + $cantidad WHERE id_producto = $id_producto");

    // Eliminar el producto del detalle
    $conn->query("DELETE FROM DETALLEVENTA WHERE id_detalle = $id_detalle");

    return ['success' => true];
}


/**
 * Borra todos los productos del carrito y devuelve el stock a su estado original.
 * 
 * @return array Resultado de la operación
 */
function borrarTodoCarrito() {
    global $conn;
    $id_venta = obtenerVentaAbierta();

    // Recuperar los productos y cantidades
    $res = $conn->query("SELECT id_producto, cantidad FROM DETALLEVENTA WHERE id_venta = $id_venta");
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $id_producto = $row['id_producto'];
            $cantidad = (int)$row['cantidad'];
            $conn->query("UPDATE PRODUCTO SET stock = stock + $cantidad WHERE id_producto = $id_producto");
        }
    }

    // Eliminar todos los detalles de venta
    $conn->query("DELETE FROM DETALLEVENTA WHERE id_venta = $id_venta");

    return ['success' => true];
}


/**
 * Actualiza la cantidad de un producto en el carrito y ajusta el stock.
 * 
 * @param int $id_detalle ID del detalle de venta
 * @param int $cantidad Nueva cantidad deseada
 * @return array Resultado de la operación
 */
function actualizarCantidad($id_detalle, $cantidad) {
    global $conn;
    if ($cantidad < 1) return ['error' => 'Cantidad inválida'];

    // Obtener información actual del detalle
    $res = $conn->query("SELECT d.id_producto, d.cantidad AS cantidad_actual, p.precio_venta, p.stock, v.estado
                         FROM DETALLEVENTA d
                         JOIN PRODUCTO p ON d.id_producto = p.id_producto
                         JOIN VENTA v ON d.id_venta = v.id_venta
                         WHERE d.id_detalle = $id_detalle");

    if (!$res || $res->num_rows == 0) return ['error' => 'Detalle no encontrado'];

    $fila = $res->fetch_assoc();
    if ($fila['estado'] !== 'ABIERTA') return ['error' => 'No se puede modificar la venta cerrada'];

    $stock_actual = (int)$fila['stock'];
    $cantidad_actual = (int)$fila['cantidad_actual'];
    $id_producto = (int)$fila['id_producto'];
    $precio_venta = (float)$fila['precio_venta'];

    $diferencia = $cantidad - $cantidad_actual;
    if ($diferencia > 0 && $stock_actual < $diferencia) return ['error' => 'Stock insuficiente'];

    $nuevo_stock = $stock_actual - $diferencia;
    $conn->query("UPDATE PRODUCTO SET stock = $nuevo_stock WHERE id_producto = $id_producto");

    $subtotal = $cantidad * $precio_venta;
    $conn->query("UPDATE DETALLEVENTA SET cantidad = $cantidad, subtotal = $subtotal WHERE id_detalle = $id_detalle");

    return ['success' => true];
}
?>
