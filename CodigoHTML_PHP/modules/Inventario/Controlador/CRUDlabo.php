<?php

/**
 * Agrega un nuevo laboratorio a la base de datos.
 */
function agregarLaboratorio($nombre, $direccion) {
    global $conn;

    $nombre = $conn->real_escape_string($nombre);
    $direccion = $conn->real_escape_string($direccion);

    $sql = "INSERT INTO LABORATORIO (nombre, direccion) VALUES ('$nombre', '$direccion')";

    if ($conn->query($sql)) {
        return ['success' => true, 'id_laboratorio' => $conn->insert_id];
    } else {
        return ['error' => 'No se pudo agregar el laboratorio.'];
    }
}

function listarLaboratorios() {
    global $conn; 
    $sql = "SELECT id_laboratorio, nombre FROM laboratorio";
    $resultado = mysqli_query($conn, $sql);

    $laboratorios = [];
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $laboratorios[] = $fila;
    }
    return $laboratorios;
}


?>