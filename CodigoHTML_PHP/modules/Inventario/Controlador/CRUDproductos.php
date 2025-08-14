<?php
require_once '../Controlador/CRUDlabo.php';
/**
 * CRUD PRODUCTO
 * 
 * Este conjunto de funciones permite crear, leer (buscar), actualizar y eliminar productos
 * en el sistema, incluyendo su nombre, precio, stock, fecha de expiración y laboratorio asociado.
 */

/**
 * Agrega un nuevo producto a la base de datos.
 */
function agregarProducto($nom_prod, $precio, $stock, $fecha_expiracion, $id_laboratorio) {
    global $conn;

    $nom_prod = $conn->real_escape_string($nom_prod);
    $precio = (float)$precio;
    $stock = (int)$stock;
    $fecha_expiracion = $conn->real_escape_string($fecha_expiracion);
    $id_laboratorio = (int)$id_laboratorio;

    $sql = "INSERT INTO PRODUCTO (nom_prod, precio, stock, fecha_expiracion, id_laboratorio)
            VALUES ('$nom_prod', $precio, $stock, '$fecha_expiracion', $id_laboratorio)";

    if ($conn->query($sql)) {
        return ['success' => true, 'id_producto' => $conn->insert_id];
    } else {
        return ['error' => 'No se pudo agregar el producto.'];
    }
}

/**
 * Modifica los datos de un producto existente.
 */
function modificarProducto($id_producto, $nom_prod, $precio, $stock, $fecha_expiracion, $id_laboratorio) {
    global $conn;

    $id_producto = (int)$id_producto;
    $nom_prod = $conn->real_escape_string($nom_prod);
    $precio = (float)$precio;
    $stock = (int)$stock;
    $fecha_expiracion = $conn->real_escape_string($fecha_expiracion);
    $id_laboratorio = (int)$id_laboratorio;

    $sql = "UPDATE PRODUCTO
            SET nom_prod = '$nom_prod',
                precio = $precio,
                stock = $stock,
                fecha_expiracion = '$fecha_expiracion',
                id_laboratorio = $id_laboratorio
            WHERE id_producto = $id_producto";

    if ($conn->query($sql)) {
        return ['success' => true];
    } else {
        return ['error' => 'No se pudo modificar el producto.'];
    }
}

/**
 * Elimina un producto de la base de datos por su ID.
 */
function eliminarProducto($id_producto) {
    global $conn;
    $id_producto = (int)$id_producto;

    $sql = "DELETE FROM PRODUCTO WHERE id_producto = $id_producto";

    if ($conn->query($sql)) {
        return ['success' => true];
    } else {
        return ['error' => 'No se pudo eliminar el producto.'];
    }
}

/**
 * Busca productos que coincidan con el término ingresado.
 */
function buscarProductos($term) {
    global $conn;
    $term = $conn->real_escape_string($term);

    $sql = "SELECT p.id_producto, p.nom_prod, p.precio, p.stock, p.fecha_expiracion,l.id_laboratorio, l.nombre AS laboratorio
            FROM PRODUCTO p
            JOIN LABORATORIO l ON p.id_laboratorio = l.id_laboratorio
            WHERE p.nom_prod LIKE '$term%' OR p.id_producto LIKE '$term%'
            ORDER BY p.nom_prod
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