<?php
require_once '../Controlador/CRUDlabo.php';
/**
 * CRUD PRODUCTO
 * 
 * Este conjunto de funciones permite crear, leer (buscar), actualizar y eliminar productos
 * en el sistema, incluyendo su nombre, precio_base, stock, fecha de expiración y laboratorio asociado.
 */

/**
 * Agrega un nuevo producto a la base de datos.
 */

function agregarProducto($nom_prod, $precio_base, $porcentaje_g, $stock, $fecha_expiracion, $id_laboratorio, $complemento, $lote) {
    global $conn;

    $nom_prod = $conn->real_escape_string($nom_prod);
    $complemento = $conn->real_escape_string($complemento);
    $lote = $conn->real_escape_string($lote);
    $fecha_expiracion = $conn->real_escape_string($fecha_expiracion);
    $precio_base = (float)$precio_base;
    $porcentaje_g = (float)$porcentaje_g;
    $stock = (int)$stock;
    $id_laboratorio = (int)$id_laboratorio;

    $precio_venta = $precio_base + ($precio_base * $porcentaje_g / 100);

    $sql = "INSERT INTO PRODUCTO (nom_prod, precio_base, porcentaje_g, complemento, precio_venta, stock, fecha_expiracion, id_laboratorio, lote)
            VALUES ('$nom_prod', $precio_base, $porcentaje_g, '$complemento', $precio_venta, $stock, '$fecha_expiracion', $id_laboratorio, '$lote')";

    if ($conn->query($sql)) {
        $id_producto = $conn->insert_id;

        // Registrar en historial
        $conn->query("INSERT INTO historial_producto
            (id_producto, lote, nom_prod, complemento, precio_venta, stock_antiguo, stock_nuevo, fecha, hora, nombre_laboratorio)
            SELECT 
                $id_producto,
                '$lote',
                '$nom_prod',
                '$complemento',
                $precio_venta,
                0 AS stock_antiguo,
                $stock AS stock_nuevo,
                CURDATE(),
                CURTIME(),
                nombre
            FROM LABORATORIO
            WHERE id_laboratorio = $id_laboratorio");

        return ['success' => true, 'id_producto' => $id_producto];
    } else {
        return ['error' => 'No se pudo agregar el producto. ' . $conn->error];
    }
}

function modificarProducto($id_producto, $nom_prod, $precio_base, $stock, $fecha_expiracion, $id_laboratorio, $porcentaje_g, $complemento, $lote) {
    global $conn;

    $id_producto = (int)$id_producto;
    $nom_prod = $conn->real_escape_string($nom_prod);
    $complemento = $conn->real_escape_string($complemento);
    $lote = $conn->real_escape_string($lote);
    $fecha_expiracion = $conn->real_escape_string($fecha_expiracion);
    $precio_base = (float)$precio_base;
    $porcentaje_g = (int)$porcentaje_g;
    $stock = (int)$stock;
    $id_laboratorio = (int)$id_laboratorio;

    // Obtener stock antiguo
    $res = $conn->query("SELECT stock FROM PRODUCTO WHERE id_producto = $id_producto");
    if (!$res || $res->num_rows === 0) return ['error'=>'Producto no encontrado'];
    $stock_antiguo = (int)$res->fetch_assoc()['stock'];

    $precio_venta = $precio_base + ($precio_base * $porcentaje_g / 100);

    $sql = "UPDATE PRODUCTO
        SET nom_prod='$nom_prod',
            precio_base=$precio_base,
            porcentaje_g=$porcentaje_g,
            complemento='$complemento',
            precio_venta=$precio_venta,
            stock=$stock,
            fecha_expiracion='$fecha_expiracion',
            id_laboratorio=$id_laboratorio,
            lote='$lote'
        WHERE id_producto=$id_producto";

    if ($conn->query($sql)) {
        if ($stock_antiguo != $stock) {
            // Registrar historial solo si cambia stock
            $conn->query("INSERT INTO historial_producto
                (id_producto, lote, nom_prod, complemento, precio_venta, stock_antiguo, stock_nuevo, fecha, hora, nombre_laboratorio)
                SELECT 
                    $id_producto,
                    '$lote',
                    '$nom_prod',
                    '$complemento',
                    $precio_venta,
                    $stock_antiguo,
                    $stock,
                    CURDATE(),
                    CURTIME(),
                    nombre
                FROM LABORATORIO
                WHERE id_laboratorio=$id_laboratorio");
        }
        return ['success'=>true];
    } else {
        return ['error'=>'No se pudo modificar el producto. ' . $conn->error];
    }
}

function eliminarProducto($id_producto) {
    global $conn;
    $id_producto = (int)$id_producto;

    // Obtener datos antes de eliminar
    $res = $conn->query("SELECT stock, lote, nom_prod, complemento, precio_venta, id_laboratorio FROM PRODUCTO WHERE id_producto=$id_producto");
    if (!$res || $res->num_rows === 0) return ['error'=>'Producto no encontrado'];
    $p = $res->fetch_assoc();

    $stock = (int)$p['stock'];
    $lote = $conn->real_escape_string($p['lote']);
    $nom_prod = $conn->real_escape_string($p['nom_prod']);
    $complemento = $conn->real_escape_string($p['complemento']);
    $precio_venta = (float)$p['precio_venta'];
    $id_laboratorio = (int)$p['id_laboratorio'];

    // Registrar historial antes de eliminar
    $conn->query("INSERT INTO historial_producto
        (id_producto, lote, nom_prod, complemento, precio_venta, stock_antiguo, stock_nuevo, fecha, hora, nombre_laboratorio)
        SELECT 
            $id_producto,
            '$lote',
            '$nom_prod',
            '$complemento',
            $precio_venta,
            $stock,
            0,
            CURDATE(),
            CURTIME(),
            nombre
        FROM LABORATORIO
        WHERE id_laboratorio=$id_laboratorio");

    // Eliminar registros de DETALLEVENTA que usan este producto
    $conn->query("DELETE FROM DETALLEVENTA WHERE id_producto=$id_producto");

    // Finalmente eliminar el producto
    if ($conn->query("DELETE FROM PRODUCTO WHERE id_producto=$id_producto")) {
        return ['success'=>true];
    } else {
        return ['error'=>'No se pudo eliminar el producto. ' . $conn->error];
    }
}



/**
 * Busca productos que coincidan con el término ingresado.
 */
function buscarProductos($term) {
    global $conn;
    $term = $conn->real_escape_string($term);

    $sql = "SELECT p.id_producto, p.nom_prod,p.complemento,p.precio_base, p.stock,p.lote,p.porcentaje_g,p.precio_venta, p.fecha_expiracion,l.id_laboratorio, l.nombre AS laboratorio
            FROM PRODUCTO p
            JOIN LABORATORIO l ON p.id_laboratorio = l.id_laboratorio
            WHERE p.nom_prod LIKE '$term%' OR p.id_producto LIKE '$term%'
            ORDER BY p.id_producto,p.nom_prod
            LIMIT 20";

    $res = $conn->query($sql);
    $productos = [];

    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $productos[] = $row;
        }
    }

    return $productos;
}

?>