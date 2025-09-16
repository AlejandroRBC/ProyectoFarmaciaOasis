<?php
require_once '../../../config/conexion.php';// Incluye la conexión a la base de datos
require_once '../Controlador/carrito.php';
require_once '../Controlador/CRUDlabo.php';
require_once '../Controlador/CRUDproductos.php';
require_once '../Controlador/venta.php';
require_once '../Controlador/AJAX.php';
// Obtener datos para cargar la vista
$productos = buscarProductos('');
$carrito = obtenerCarrito();
$laboratorios = listarLaboratorios();
?>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Inventario</title>
    <link rel="stylesheet" href="css/estiloCelda.css" />
    <link rel="stylesheet" href="css/responsive.css" />
    <link rel="stylesheet" href="css/iconos.css" />
    <link rel="stylesheet" href="css/botones.css" />
    <link rel="stylesheet" href="css/carrito.css" />
    <link rel="stylesheet" href="css/modal.css" />
    <link rel="stylesheet" href="css/factura.css" />
    <link rel="stylesheet" href="css/buscador.css" />
    <link rel="stylesheet" href="css/titulo.css" />
    <link rel="stylesheet" href="../../../assets/css/estiloTabla.css">
</head>
<body>
    <!-- NAVBAR: logo y botón del carrito que cuando se agrega un producto aparecera un contador-->
    <!-- Llamar al navbar -->
        <script src="../../NavBar/Vista/javaScript/script.js"></script>
        <link rel="stylesheet" href="../../NavBar/Vista/css/estilos.css">
        <?php 
        require('../../NavBar/Vista/Principal.php');
        ?>
    <!-- Fin de la llamada de Navbar -->
    <div class="containerCarrito">
        <a class="cart-icon" onclick="mostrarCarrito()" title="Ver carrito">
            <img src="img/Carrito.png" alt="Carrito" class="icono" />
            <?php
            $total_items = 0;
            foreach ($carrito as $item) {
                $total_items += $item['cantidad'];
            }
            if ($total_items > 0): ?>
                <span class="contador-carrito"><?= $total_items ?></span>
            <?php endif; ?>
        </a>
    </div>
    
    <!-- INVENTARIO DE PRODUCTOS -->
    <main>
        <h1>INVENTARIO</h1>

       <!-- Buscador con autocompletado -->
        <div class="busqueda-container">
            <input type="text" placeholder="¿Qué estás buscando?" class="busqueda" id="busqueda" autocomplete="off" />
            <img src="img/lupa.png" alt="Buscar" class="icono" title="Buscar" style="cursor:pointer;" id="btnBuscar" />
        </div>
        <!-- Tabla de productos -->
        <div style="max-height: 350px; overflow-y: auto; margin-top: 20px;">
            <table>
                <thead>
                    <tr>
                        <th>CÓDIGO</th>
                        <th>X</th>
                        <th>LOTE</th>
                        <th>NOMBRE</th>
                        <th>Y</th>
                        <th>Complemento</th>
                        <th>PRECIO BASE</th>
                        <th>PRECIO VENTA</th>
                        <th>STOCK</th>
                        <th>Fecha Exp.</th>
                        <th>LABORATORIO</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($productos as $prod): ?>
                        <tr>
                            <td><?= htmlspecialchars($prod['id_producto']) ?></td>
                            <td></td>
                            <td><?= htmlspecialchars($prod['lote']) ?></td>
                            <td><?= htmlspecialchars($prod['nom_prod']) ?></td>
                            <td></td>
                            <td><?= htmlspecialchars($prod['complemento']) ?></td>
                            <td><?= htmlspecialchars($prod['precio_base']) ?> Bs</td>
                            <td><?= htmlspecialchars($prod['precio_venta']) ?> Bs</td>
                            <td id="stock-prod-<?= $prod['id_producto'] ?>"><?= htmlspecialchars($prod['stock']) ?></td>
                            <td><?= htmlspecialchars($prod['fecha_expiracion']) ?></td>
                            <td><?= htmlspecialchars($prod['laboratorio']) ?></td>

                            <!-- DEBEMOS CAMBIAR EL SENTIDO DE ESTO, POR ESO SE REINICIA LA PAGINA CADA QUE SE AGREGA UN ITEM AL CARRITO -->
                            <td>
                                <!-- Formulario oculto para agregar producto al carrito -->
                                <form id="form-<?= $prod['id_producto'] ?>" method="POST" style="display:none;">
                                    <input type="hidden" name="id_producto" value="<?= $prod['id_producto'] ?>" />
                                    <input type="hidden" name="agregar_producto" value="1" />
                                </form>
                                <img src="img/CarritoA.png" alt="Agregar al carrito" class="icono" title="Agregar al carrito" style="cursor:pointer;" onclick="document.getElementById('form-<?= $prod['id_producto'] ?>').submit();"/>
                            </td>
                            <td>
                                <!-- BOTONES PARA ABRIR LOS MODALES DE ELIMINAR Y MODIFICAR PRODUCTO -->
                                <button
                                    onclick="abrirModalModificar
                                    (
                                        <?= $prod['id_producto'] ?>,
                                        '<?= addslashes($prod['nom_prod']) ?>',
                                        <?= $prod['lote'] ?>,
                                        <?= $prod['precio_base'] ?>,
                                        <?= $prod['stock'] ?>,
                                        '<?= $prod['fecha_expiracion'] ?>',
                                        <?= $prod['id_laboratorio'] ?>,
                                        <?= $prod['porcentaje_g'] ?>,
                                        '<?= $prod['complemento'] ?>'
                                    )"
                                >
                                    Modificar
                                </button>

                                <button onclick="abrirModalEliminar(<?= $prod['id_producto'] ?>)">Eliminar</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <!-- MODAL MODIFICAR PRODUCTO -->
        <div id="modalModificar" class="modal" >
            <div class="modal-contenido">
                <span class="cerrar" onclick="cerrarModalModificar()">&times;</span>
                <h2>Modificar Producto</h2>
                <form method="POST">
                    
                    <input type="hidden" id="mod_id_producto" name="id_producto">

                    <label for="mod_nombre">
                        Nombre:
                    </label>
                    <input type="text" id="mod_nombre" name="nombre" required>

                    <label for="mod_complemento">Complemento:</label>
                    <input type="text" id="mod_complemento" name="complemento" required>

                    <label for="mod_lote">
                        Lote:
                    </label>
                    <input type="text" id="mod_lote" name="lote" required>

                    <label for="mod_precio">
                        Precio Base:
                    </label>
                    <input type="number" step="0.01" id="mod_precio" name="precio_base" required>

                    <label for="mod_porcentaje">
                        Porcentaje Ganancia:
                    </label>
                    <input type="number" id="mod_porcentaje" name="porcentaje_g" placeholder="%" step="1">

                    <label for="mod_stock">
                        Stock:
                    </label>
                    <input type="number" id="mod_stock" name="stock" required>

                    <label for="mod_fecha_expiracion">
                        Fecha de Expiración:
                    </label>
                    <input type="date" id="mod_fecha_expiracion" name="fecha_expiracion" required>

                    <label for="mod_id_laboratorio">
                        Laboratorio:
                    </label>
                    <select id="mod_id_laboratorio" name="id_laboratorio" required>
                        <?php foreach ($laboratorios as $lab): ?>
                            <option value="<?= $lab['id_laboratorio'] ?>">
                                <?= htmlspecialchars($lab['nombre']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>

                    <div class="botones">
                        <button type="submit" name="modificar_producto">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- MODAL ELIMINAR PRODUCTO -->
        <div id="modalEliminar" class="modal">
            <div class="modal-contenido">
                <span class="cerrar" onclick="cerrarModalEliminar()">&times;</span>
                <h2>¿Eliminar producto?</h2>
                <form method="POST" action="">
                    <input type="hidden" id="elim_id_producto" name="id_producto">
                    <button type="submit" name="eliminar_producto_def">Eliminar</button>
                </form>
            </div>
        </div>

        <!-- BOTÓN PARA ABRIR EL MODAL AGREGAR PRODUCTO -->
        <div style="text-align: center;">
            <button onclick="abrirModalAgregar()">Agregar Producto</button>
            <button onclick="abrirModalAgregarLaboratorio()">Agregar Laboratorio</button>
        </div>

        <!-- MODAL AGREGAR PRODUCTO -->
        <div id="modalAgregar" class="modal" >
            <div class="modal-contenido">
                <span class="cerrar" onclick="cerrarModalAgregar()">&times;</span>
                <h2>Agregar Nuevo Producto</h2>
                <form method="POST" action="">
                <label>Nombre:</label>
                <input type="text" name="nombre" required>
                
                <label>Lote:</label>
                <input type="number" name="lote" required>

                <label>Complemento (presentación):</label>
                <input type="text" name="complemento" required>

                <label>Precio Base:</label>
                <input type="number" name="precio_base" step="0.01" required>

                <label>Porcentaje Ganancia:</label>
                <input type="number" name="porcentaje_g" step="1" placeholder="%">

                <label>Stock:</label>
                <input type="number" name="stock" required>

                <label>Fecha de Expiración:</label>
                <input type="date" name="fecha_expiracion" required>

                <label>Laboratorio:</label>
                <select name="id_laboratorio" required>
                    <option value="">Seleccionar laboratorio</option>
                    <?php foreach ($laboratorios as $lab): ?>
                        <option value="<?= $lab['id_laboratorio'] ?>"><?= htmlspecialchars($lab['nombre']) ?></option>
                    <?php endforeach; ?>
                </select>


                    <br><br>
                    <button type="submit" name="agregar_nuevo_producto">Agregar Producto</button>
                </form>
                <div id="mensaje"></div>
            </div>
        </div>

        <!-- MODAL AGREGAR LABORATORIO -->
        <div id="modalAgregarLaboratorio" class="modal">
            <div class="modal-contenido" >
                <span class="cerrar" onclick="cerrarModalAgregarLaboratorio()" >&times;</span>
                <h2>Agregar Laboratorio</h2>
                <form method="POST">
                    <label for="nombre_laboratorio">Nombre:</label><br>
                    <input type="text" id="nombre_laboratorio" name="nombre_laboratorio" required><br><br>

                    <label for="direccion_laboratorio">Dirección:</label><br>
                    <input type="text" id="direccion_laboratorio" name="direccion_laboratorio" required><br><br>

                    <button type="submit" name="agregar_nuevo_laboratorio">Agregar</button>
                </form>
            </div>
        </div>

    </main>

    <!-- CARRITO DE COMPRAS -->
    <div id="MenuCarrito" class="menu-carrito">

        <!-- Botón cerrar -->
        <button onclick="mostrarCarrito()" >X</button>

        <!-- Título -->
        <h1>CARRITO DE COMPRAS</h1>
        <hr />

        <?php $totalVenta = 0; ?>

        <div id="carrito-contenido">
            <?php if (empty($carrito)): ?>
                <p>El carrito está vacío.</p>
            <?php else: ?>
                <?php 
                $totalVenta = 0; // acumulador
                foreach ($carrito as $item): 
                    $totalVenta += $item['subtotal']; // sumar subtotales
                ?>
                    <div class="carrito-item">
                        <p>
                            <strong>Nombre Producto:</strong>
                            <?= htmlspecialchars($item['nom_prod']) ?>
                        </p>
                        <p>
                            <strong>Complemento:</strong>
                            <?= htmlspecialchars($item['complemento']) ?>
                        </p>

                        <div>
                            <strong>Cantidad:</strong>
                            <span><?= $item['cantidad'] ?></span>
                            <button class="btn-cantidad"
                                data-accion="aumentar"
                                data-id="<?= $item['id_detalle'] ?>"
                                data-cantidad="<?= $item['cantidad'] ?>">+</button>
                            <button class="btn-cantidad"
                                data-accion="disminuir"
                                data-id="<?= $item['id_detalle'] ?>"
                                data-cantidad="<?= $item['cantidad'] ?>">−</button>
                        </div>

                        <hr />
                        <p>Total: <?= number_format($item['subtotal'], 2) ?> Bs</p>
                        <button class="btn-eliminar" data-id="<?= $item['id_detalle'] ?>">Borrar</button>
                    </div>
                <?php endforeach; ?>
                
                <hr />
            <?php endif; ?>
        </div>
        <h3 id="total-venta" style="text-align:right;">
            TOTAL DE VENTA: <?= number_format($totalVenta, 2) ?> Bs
        </h3>
        <!-- Botones generales PARA EL CARRITO-->
        <div style="margin-top: 15px; display: flex; gap: 10px;">
            <form method="POST" style="margin: 0;">
                <button type="button" id="btn-borrar-todo">Borrar Todo</button>
            </form>
            <button type="button" onclick="mostrarModal()">Realizar Venta</button>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 10px;">
            <button type="button" onclick="VentaRapida()">Venta Rapida</button>
        </div>
        <!-- Modal para los datos del cliente -->
        <div id="modalCompra" class="modal">
            <form method="POST" action="generar_venta.php" class="modal-contenido">
                <span onclick="cerrarModal()" class="cerrar" title="Cerrar">&times;</span>
                <h2>Datos del Cliente </h2>

                <input name="nombre_cliente" placeholder="Nombre del Cliente" required><br><br>
                <input name="ci_nit" placeholder="CI / NIT" required><br><br>
                <select name="metodo_pago" id="metodo_pago" required>
                    <option value="" disabled selected>Metodo de Pago</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="qr">QR</option>
                    <option value="mixto">Mixto</option>
                </select>
                <br><br>

                <button type="submit">Generar Venta</button>
            </form>
        </div>
        <!-- Modal para Venta Rapida-->
        <div id="modalVentaRapida" class="modal">
            <form method="POST" action="generar_venta.php" class="modal-contenido">
                <span onclick="cerrarVentaRapida()" class="cerrar" title="Cerrar">&times;</span>
                <select name="metodo_pago" id="metodo_pago" required>
                    <h2>Venta Rapida </h2>
                    <option value="" disabled selected>Metodo de Pago</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="qr">QR</option>
                    <option value="mixto">Mixto</option>
                </select>
                <br><br>
                <button type="submit">Generar Venta</button>
            </form>
        </div>

    </div>
    <!-- SCRIPT JS -->
    <script src="javaScript/modales.js"></script>
    <script src="javaScript/filtroTabla.js"></script>
    <script src="javaScript/AJAX.js"></script>
    <script src="javaScript/validaciones.js"></script>
</body>
</html>