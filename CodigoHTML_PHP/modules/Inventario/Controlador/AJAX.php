<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // LLAMADO AJAX
    if (isset($_POST['ajax'])) {
        $accion = $_POST['accion'] ?? '';
        $id_detalle = (int)($_POST['id_detalle'] ?? 0);
        $cantidad = (int)($_POST['cantidad'] ?? 1);

        switch ($accion) {
            case 'aumentar':
                actualizarCantidad($id_detalle, $cantidad + 1);
                break;
            case 'disminuir':
                actualizarCantidad($id_detalle, max(1, $cantidad - 1));
                break;
            case 'eliminar':
                eliminarProductoCarrito($id_detalle);
                break;
            case 'borrar_todo': // Agrega este caso para borrar todo via ajax si quieres hacerlo por ajax
                borrarTodoCarrito();
                break;
        }

        $carrito = obtenerCarrito();
        $total_items = 0;
        $total_venta = 0;
        foreach ($carrito as $item) {
            $total_items += $item['cantidad'];
            $total_venta += $item['subtotal'];
        }
        $productos = buscarProductos('');
        echo json_encode([
            'carrito' => $carrito,
            'total_items' => $total_items,
            'total_venta' => number_format($total_venta, 2, '.', ''),
            'productos' => $productos
        ]);
        exit;
    }

    //MODO NORMAL SIN AJAX

    //CRUD

    // Agregar producto 

    if (isset($_POST['agregar_nuevo_producto'])) {
        $nombre = $_POST['nombre'];
        $precio = (float)$_POST['precio'];
        $stock = (int)$_POST['stock'];
        $fecha_expiracion = $_POST['fecha_expiracion'];
        $id_laboratorio = (int)$_POST['id_laboratorio'];
        agregarProducto($nombre, $precio, $stock, $fecha_expiracion, $id_laboratorio);
    }

    // Agregar laboratorio
    if (isset($_POST['agregar_nuevo_laboratorio'])) {
        $nombre = $_POST['nombre_laboratorio'];
        $direccion = $_POST['direccion_laboratorio'];
        agregarLaboratorio($nombre, $direccion);
    }

    // Modificar producto
    if (isset($_POST['modificar_producto'])) {
        $id_producto = (int)$_POST['id_producto'];
        $nombre = $_POST['nombre'];
        $precio = (float)$_POST['precio'];
        $stock = (int)$_POST['stock'];
        $fecha_expiracion = $_POST['fecha_expiracion'];
        $id_laboratorio = (int)$_POST['id_laboratorio'];
        modificarProducto($id_producto, $nombre, $precio, $stock, $fecha_expiracion, $id_laboratorio);
    }

    // Eliminar producto
    if (isset($_POST['eliminar_producto_def'])) {
        $id_producto = (int)$_POST['id_producto'];
        eliminarProducto($id_producto);
    }

    //CARRITO

    // Agregar al carrito desde botón
    if (isset($_POST['agregar_producto'])) {
        $id_producto = (int)$_POST['id_producto'];
        agregarAlCarrito($id_producto, 1);
    }
    // Vaciar todo el carrito
    if (isset($_POST['borrar_todo'])) {
        borrarTodoCarrito();
    }
}

?>