<?php
require_once '../Modelo/codigo.php';

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
        }

        $carrito = obtenerCarrito();
        $total_items = 0;
        foreach ($carrito as $item) {
            $total_items += $item['cantidad'];
        }
        $productos = buscarProductos('');
        echo json_encode([
            'carrito' => $carrito,
            'total_items' => $total_items,
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
    <link rel="stylesheet" href="css/estilos.css" />
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
                        <th>NOMBRE</th>
                        <th>STOCK</th>
                        <th>PRECIO</th>
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
                            <td><?= htmlspecialchars($prod['nom_prod']) ?></td>
                            <td id="stock-prod-<?= $prod['id_producto'] ?>"><?= htmlspecialchars($prod['stock']) ?></td>
                            <td><?= htmlspecialchars($prod['precio']) ?> Bs</td>
                            <td><?= htmlspecialchars($prod['fecha_expiracion']) ?></td>
                            <td><?= htmlspecialchars($prod['laboratorio']) ?></td>
                            <td>
                                <!-- Formulario oculto para agregar producto al carrito -->
                                <form id="form-<?= $prod['id_producto'] ?>" method="POST" style="display:none;">
                                    <input type="hidden" name="id_producto" value="<?= $prod['id_producto'] ?>" />
                                    <input type="hidden" name="agregar_producto" value="1" />
                                </form>
                                <img
                                    src="img/CarritoA.png"
                                    alt="Agregar al carrito"
                                    class="icono"
                                    title="Agregar al carrito"
                                    style="cursor:pointer;"
                                    onclick="document.getElementById('form-<?= $prod['id_producto'] ?>').submit();"
                                />
                            </td>
                            <td>
                                <!-- BOTONES PARA ABRIR LOS MODALES DE ELIMINAR Y MODIFICAR PRODUCTO -->
                                <button
                                    onclick="abrirModalModificar(
                                        <?= $prod['id_producto'] ?>,
                                        '<?= addslashes($prod['nom_prod']) ?>',
                                        <?= $prod['precio'] ?>,
                                        <?= $prod['stock'] ?>,
                                        '<?= $prod['fecha_expiracion'] ?>',
                                        <?= $prod['id_laboratorio'] ?>
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
        <div id="modalModificar" class="modal" style="display:none;">
            <div class="modal-contenido">
                <span class="cerrar" onclick="cerrarModalModificar()">&times;</span>
                <h2>Modificar Producto</h2>
                <form method="POST">
                    <input type="hidden" id="mod_id_producto" name="id_producto">

                    <label for="mod_nombre">Nombre:</label>
                    <input type="text" id="mod_nombre" name="nombre" required>

                    <label for="mod_precio">Precio:</label>
                    <input type="number" step="0.01" id="mod_precio" name="precio" required>

                    <label for="mod_stock">Stock:</label>
                    <input type="number" id="mod_stock" name="stock" required>

                    <label for="mod_fecha_expiracion">Fecha de Expiración:</label>
                    <input type="date" id="mod_fecha_expiracion" name="fecha_expiracion" required>

                    <label for="mod_id_laboratorio">Laboratorio:</label>
                    <select id="mod_id_laboratorio" name="id_laboratorio" required>
                        <?php foreach ($laboratorios as $lab): ?>
                            <option value="<?= $lab['id_laboratorio'] ?>"><?= htmlspecialchars($lab['nombre']) ?></option>
                        <?php endforeach; ?>
                    </select>

                    <div class="botones">
                        <button type="submit" name="modificar_producto">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- MODAL ELIMINAR PRODUCTO -->
        <div id="modalEliminar" class="modal" style="display:none;">
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
        <div class="botones">
            <button onclick="abrirModalAgregar()">Agregar Producto</button>
            <button onclick="abrirModalAgregarLaboratorio()">Agregar Laboratorio</button>
        </div>

        <!-- MODAL AGREGAR PRODUCTO -->
        <div id="modalAgregar" class="modal" style="display:none;">
            <div class="modal-contenido">
                <span class="cerrar" onclick="cerrarModalAgregar()">&times;</span>
                <h2>Agregar Nuevo Producto</h2>
                <form method="POST" action="">
                    <label>Nombre:</label>
                    <input type="text" name="nombre" required>

                    <label>Precio:</label>
                    <input type="number" name="precio" step="0.01" required>

                    <label>Stock:</label>
                    <input type="number" name="stock" required>

                    <label>Fecha de Expiración:</label>
                    <input type="date" name="fecha_expiracion" required>

                    <label>Laboratorio:</label>
                    <select name="id_laboratorio" required>
                        <option value="">Seleccionar laboratorio</option>
                        <?php
                        foreach ($laboratorios as $lab) {
                            echo "<option value=\"{$lab['id_laboratorio']}\">{$lab['nombre']}</option>";
                        }
                        ?>
                    </select>

                    <br><br>
                    <button type="submit" name="agregar_nuevo_producto">Agregar Producto</button>
                </form>
            </div>
        </div>

        <!-- MODAL AGREGAR LABORATORIO -->
        <div id="modalAgregarLaboratorio" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
             background-color:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
            <div class="modal-contenido" style="background:#fff; padding:20px; border-radius:10px; position:relative; width: 300px;">
                <span class="cerrar" onclick="cerrarModalAgregarLaboratorio()" 
                      style="position:absolute; top:10px; right:15px; font-size:24px; font-weight:bold; cursor:pointer;">&times;</span>
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
    <button onclick="mostrarCarrito()" style="position: absolute; top: 10px; right: 10px;">X</button>

    <!-- Título -->
    <h1>CARRITO DE COMPRAS</h1>
    <hr />

    <!-- Contenido dinámico del carrito -->
    <div id="carrito-contenido">
        <?php if (empty($carrito)): ?>
        <p>El carrito está vacío.</p>
        <?php else: ?>
        <?php foreach ($carrito as $item): ?>
            <div class="carrito-item">
            <!-- Nombre del producto -->
            <p>
                <strong>Nombre Producto:</strong>
                <?= htmlspecialchars($item['nom_prod']) ?>
            </p>

            <!-- Cantidad + botones -->
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

            <!-- Subtotal y botón eliminar -->
            <hr />
            <p>Total: <?= number_format($item['subtotal'], 2) ?> Bs</p>
            <button class="btn-eliminar" data-id="<?= $item['id_detalle'] ?>">Borrar</button>
            </div>
        <?php endforeach; ?>
        <?php endif; ?>
    </div>

    <!-- Botones generales -->
    <div style="margin-top: 15px; display: flex; gap: 10px;">
        <form method="POST" style="margin: 0;">
        <button type="submit" name="borrar_todo">Borrar Todo</button>
        </form>
        <button type="button" onclick="mostrarModal()">Realizar Compra</button>
    </div>
    </div>
                
    <!-- Modal para los datos del cliente -->
    <div id="modalCompra" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
            <form method="POST" action="generar_factura.php" class="modal-contenid" style="background:#fff; padding:20px; border-radius:10px; position: relative;">
                <span onclick="cerrarModal()" class="cerrar" style="position: absolute; top: 10px; right: 15px; font-size: 24px; font-weight: bold; cursor: pointer; user-select: none;" title="Cerrar"> &times;</span>
                <h2>Datos del Cliente : </h2>
                <input name="nombre_cliente" placeholder="Nombre del Cliente" required><br><br>
                <input name="ci_nit" placeholder="CI / NIT" required><br><br>
                <button type="submit">Generar Factura</button>
            </form>
        </div>
    </div>

    <!-- SCRIPT JS -->
    <script>
        // Mostrar u ocultar el carrito
        function mostrarCarrito() {
            const menu = document.getElementById('MenuCarrito');
            menu.classList.toggle('activo');
        }

        // Lógica de filtrado en tiempo real en la tabla
        const inputBusqueda = document.querySelector('.busqueda');
        const tabla = document.querySelector('tbody');
        inputBusqueda.addEventListener('input', filtrarTabla);
        document.getElementById('btnBuscar').addEventListener('click', filtrarTabla);
        inputBusqueda.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filtrarTabla();
            }
        });

        function filtrarTabla() {
            const filtro = inputBusqueda.value.toLowerCase();
            Array.from(tabla.rows).forEach(row => {
                const codigo = row.cells[0].textContent.toLowerCase();
                const nombre = row.cells[1].textContent.toLowerCase();
                row.style.display = (codigo.startsWith(filtro) || nombre.startsWith(filtro)) ? '' : 'none';
            });
        }

        function abrirModalAgregar() {
            document.getElementById('modalAgregar').style.display = 'block';
        }

        function cerrarModalAgregar() {
            document.getElementById('modalAgregar').style.display = 'none';
        }

        function abrirModalAgregarLaboratorio() {
            document.getElementById('modalAgregarLaboratorio').style.display = 'flex';
        }

        function cerrarModalAgregarLaboratorio() {
            document.getElementById('modalAgregarLaboratorio').style.display = 'none';
        }

        function abrirModalModificar(id, nombre, precio, stock, fecha, idLab) {
            document.getElementById("mod_id_producto").value = id;
            document.getElementById("mod_nombre").value = nombre;
            document.getElementById("mod_precio").value = precio;
            document.getElementById("mod_stock").value = stock;
            document.getElementById("mod_fecha_expiracion").value = fecha;
            document.getElementById("mod_id_laboratorio").value = idLab;
            document.getElementById("modalModificar").style.display = "block";
        }

        function cerrarModalModificar() {
            document.getElementById("modalModificar").style.display = "none";
        }

        function abrirModalEliminar(id) {
            document.getElementById("elim_id_producto").value = id;
            document.getElementById("modalEliminar").style.display = "block";
        }

        function cerrarModalEliminar() {
            document.getElementById("modalEliminar").style.display = "none";
        }

        function mostrarModal() {
            document.getElementById('modalCompra').style.display = 'flex';
        }

        function cerrarModal() {
            document.getElementById('modalCompra').style.display = 'none';
        }
    </script>

    <!-- SCRIPT AJAX --> 

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const carritoDiv = document.getElementById("MenuCarrito");
                carritoDiv.addEventListener("click", async (e) => {
                    // Botones + / -
                    if (e.target.matches(".btn-cantidad")) {
                        const id = e.target.dataset.id;
                        const cantidad = parseInt(e.target.dataset.cantidad);
                        const accion = e.target.dataset.accion;
                        await enviarAccionCarrito(accion, id, cantidad);
                    }

                    // Botón borrar
                    if (e.target.matches(".btn-eliminar")) {
                        const id = e.target.dataset.id;
                        await enviarAccionCarrito("eliminar", id, 1);
                    }
                });
        });

        async function enviarAccionCarrito(accion, id_detalle, cantidad) {
        const formData = new FormData();
        formData.append("ajax", "1");
        formData.append("accion", accion);
        formData.append("id_detalle", id_detalle);
        formData.append("cantidad", cantidad);

        const res = await fetch("principal.php", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        renderCarrito(data);
        }

        function renderCarrito(data) {
        const carrito = data.carrito;
        const totalItems = data.total_items;

        // Actualizar el contenido del carrito
        const contenedor = document.getElementById("carrito-contenido");
        if (carrito.length === 0) {
            contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        } else {
            let html = "";
            carrito.forEach(item => {
            html += `
                <div class="carrito-item">
                <p><strong>Nombre Producto:</strong> ${item.nom_prod}</p>
                <div>
                    <strong>Cantidad:</strong>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad" data-accion="aumentar" data-id="${item.id_detalle}" data-cantidad="${item.cantidad}">+</button>
                    <button class="btn-cantidad" data-accion="disminuir" data-id="${item.id_detalle}" data-cantidad="${item.cantidad}">−</button>
                </div>
                <hr />
                <p>Total: ${parseFloat(item.subtotal).toFixed(2)} Bs</p>
                <button class="btn-eliminar" data-id="${item.id_detalle}">Borrar</button>
                </div>
            `;
            });
            contenedor.innerHTML = html;
        }

        // ✅ Actualizar contador del carrito
        const contador = document.querySelector(".contador-carrito");
        if (totalItems > 0) {
            if (contador) {
            contador.textContent = totalItems;
            } else {
            const span = document.createElement("span");
            span.className = "contador-carrito";
            span.textContent = totalItems;
            document.querySelector(".cart-icon").appendChild(span);
            }
        } else {
            if (contador) contador.remove();
        }

        // ✅ Actualizar stock visual
        data.productos.forEach(producto => {
            const stockSpan = document.getElementById("stock-prod-" + producto.id_producto);
            if (stockSpan) {
            stockSpan.textContent = producto.stock;
            }
        });
        }
        
    </script>

    <!-- SCRIPT PARA CIERRE FUERA DE LOS MODALES--> 

    <script>
        document.addEventListener('click', function(event) {
            // MODAL AGREGAR PRODUCTO
            const modalAgregar = document.getElementById('modalAgregar');
            if (event.target === modalAgregar) {
                cerrarModalAgregar();
            }

            // MODAL AGREGAR LABORATORIO
            const modalLab = document.getElementById('modalAgregarLaboratorio');
            if (event.target === modalLab) {
                cerrarModalAgregarLaboratorio();
            }

            // MODAL MODIFICAR PRODUCTO
            const modalMod = document.getElementById('modalModificar');
            if (event.target === modalMod) {
                cerrarModalModificar();
            }

            // MODAL ELIMINAR PRODUCTO
            const modalElim = document.getElementById('modalEliminar');
            if (event.target === modalElim) {
                cerrarModalEliminar();
            }

            // MODAL COMPRA (Datos del Cliente)
            const modalCompra = document.getElementById('modalCompra');
            if (event.target === modalCompra) {
                cerrarModal();
            }

            // CARRITO LATERAL
            const carrito = document.getElementById('MenuCarrito');
            if (carrito.classList.contains('activo') && !carrito.contains(event.target) && !event.target.closest('.cart-icon')) {
                carrito.classList.remove('activo');
            }
        });
    </script>
    
    

    
</body>
</html>