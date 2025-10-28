//Backend/index.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a SQLite
const db = new sqlite3.Database("./farmacia.db", (err) => {
  if (err) console.error("Error al conectar BD:", err);
  else console.log("Conectado a SQLite ✅");
});

// ----------------------
// Crear tablas si no existen
// ----------------------

// LABORATORIO
db.run(`CREATE TABLE IF NOT EXISTS laboratorio (
  id_lab INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_labo TEXT,
  direccion TEXT
)`);

// PROVEEDOR
db.run(`CREATE TABLE IF NOT EXISTS proveedor (
  id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  telefono TEXT,
  cantidad INTEGER,
  concepto TEXT,
  precio_unitario REAL,
  precio_total REAL
)`);

// CLIENTE
db.run(`CREATE TABLE IF NOT EXISTS cliente (
  cod_cli INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  ci_nit TEXT,
  descuento REAL,
  estado TEXT
)`);

// PRODUCTO
db.run(`CREATE TABLE IF NOT EXISTS producto (
  id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_prod TEXT,
  lote TEXT,
  fecha_exp DATE,         -- fecha de expiración
  porcentaje_g REAL,
  stock INTEGER,
  presentacion TEXT,
  precio_venta REAL,
  precio_compra REAL,
  valor_medida REAL,
  estado TEXT,
  id_lab INTEGER,
  id_proveedor INTEGER,
  FOREIGN KEY (id_lab) REFERENCES laboratorio(id_lab),
  FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
)`);

// VENTA
db.run(`CREATE TABLE IF NOT EXISTS venta (
  id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha DATE DEFAULT (DATE('now','localtime')),   -- fecha actual por defecto
  hora TIME DEFAULT (TIME('now','localtime')),    -- hora actual por defecto
  total REAL,
  metodo_pago TEXT,
  id_cliente INTEGER,
  FOREIGN KEY (id_cliente) REFERENCES cliente(cod_cli)
)`);

// DETALLE_VENTA
db.run(`CREATE TABLE IF NOT EXISTS detalle_venta (
  id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
  id_venta INTEGER,
  id_producto INTEGER,
  cantidad INTEGER,
  subtotal REAL,
  FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
)`);
//Historial Ingresos_Egresos
db.run(`CREATE TABLE IF NOT EXISTS Historial_Ingresos_Egresos (
  id_hie INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  presentacion TEXT,
  lote TEXT,
  precio_venta REAL,
  stock_antiguo INTEGER,
  stock_nuevo INTEGER,
  fecha DATE DEFAULT (DATE('now','localtime')),
  hora TIME DEFAULT (TIME('now','localtime')),
  laboratorio TEXT
)`);

//TRIGGER PARA EL HISTORIAL INGRESOS_EGRESOS
db.run(`CREATE TRIGGER IF NOT EXISTS registrar_movimiento_venta
AFTER INSERT ON detalle_venta
FOR EACH ROW
BEGIN
  INSERT INTO Historial_Ingresos_Egresos (
    nombre,
    presentacion,
    lote,
    precio_venta,
    stock_antiguo,
    stock_nuevo,
    laboratorio
  )
  SELECT 
    p.nombre_prod,
    p.presentacion,
    p.lote,
    p.precio_venta,
    p.stock,
    p.stock - NEW.cantidad,
    l.nombre_labo
  FROM producto p
  JOIN laboratorio l ON p.id_lab = l.id_lab
  WHERE p.id_producto = NEW.id_producto;
END;`);


// ----------------------
// ENDPOINTS PARA CLIENTES
// ----------------------

// GET todos los clientes
app.get("/api/clientes", (req, res) => {
  const sql = "SELECT * FROM cliente";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});
// GET cliente por ID
app.get("/api/clientes/:id", (req, res) => {
  const sql = "SELECT * FROM cliente WHERE cod_cli = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// POST crear cliente
app.post("/api/clientes", (req, res) => {
  const { nombre, ci_nit, descuento } = req.body;
  const estado = 'activo';
  
  const sql = `INSERT INTO cliente (nombre, ci_nit, descuento, estado) 
               VALUES (?, ?, ?, ?)`;
  
  db.run(sql, [nombre, ci_nit, descuento, estado], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: { 
        cod_cli: this.lastID, 
        nombre, 
        ci_nit, 
        descuento, 
        estado 
      }
    });
  });
});

// PUT actualizar cliente
app.put("/api/clientes/:id", (req, res) => {
  const { nombre, ci_nit, descuento, estado } = req.body;
  
  const sql = `UPDATE cliente 
               SET nombre = ?, ci_nit = ?, descuento = ?, estado = ? 
               WHERE cod_cli = ?`;
  
  db.run(sql, [nombre, ci_nit, descuento, estado, req.params.id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    
    db.get("SELECT * FROM cliente WHERE cod_cli = ?", [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  });
});

// DELETE cliente
app.delete("/api/clientes/:id", (req, res) => {
  const sql = "UPDATE cliente SET estado = 'inactivo' WHERE cod_cli = ?";
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ 
      data: { 
        message: 'Cliente desactivado correctamente',
        changes: this.changes 
      } 
    });
  });
});

// ----------------------
// ENDPOINTS PARA PROVEEDORES
// ----------------------

// GET todos los proveedores
app.get("/api/proveedores", (req, res) => {
  const sql = "SELECT * FROM proveedor";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET proveedor por ID
app.get("/api/proveedores/:id", (req, res) => {
  const sql = "SELECT * FROM proveedor WHERE id_proveedor = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// POST crear proveedor
app.post("/api/proveedores", (req, res) => {
  const { nombre, telefono, cantidad, concepto, precio_unitario, precio_total } = req.body;
  
  const sql = `INSERT INTO proveedor (nombre, telefono, cantidad, concepto, precio_unitario, precio_total) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [nombre, telefono, cantidad, concepto, precio_unitario, precio_total], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: { 
        id_proveedor: this.lastID, 
        nombre, 
        telefono, 
        cantidad, 
        concepto, 
        precio_unitario, 
        precio_total
      }
    });
  });
});

// PUT actualizar proveedor
app.put("/api/proveedores/:id", (req, res) => {
  const { nombre, telefono, cantidad, concepto, precio_unitario, precio_total } = req.body;
  
  const sql = `UPDATE proveedor 
               SET nombre = ?, telefono = ?, cantidad = ?, concepto = ?, 
                   precio_unitario = ?, precio_total = ?
               WHERE id_proveedor = ?`;
  
  db.run(sql, [nombre, telefono, cantidad, concepto, precio_unitario, precio_total, req.params.id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    
    db.get("SELECT * FROM proveedor WHERE id_proveedor = ?", [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  });
});





// Redirigir "/" a "/api/clientes"
app.get("/", (req, res) => {
  res.redirect("/api/proveedores");
});

// GET proveedor por ID
app.get("/api/proveedores/:id", (req, res) => {
  const sql = "SELECT * FROM proveedor WHERE id_proveedor = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// POST crear proveedor
app.post("/api/proveedores", (req, res) => {
  const { nombre, telefono, cantidad, concepto, precio_unitario, precio_total } = req.body;
  
  const sql = `INSERT INTO proveedor (nombre, telefono, cantidad, concepto, precio_unitario, precio_total) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [nombre, telefono, cantidad, concepto, precio_unitario, precio_total], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: { 
        id_proveedor: this.lastID, 
        nombre, 
        telefono, 
        cantidad, 
        concepto, 
        precio_unitario, 
        precio_total
      }
    });
  });
});

// PUT actualizar proveedor
app.put("/api/proveedores/:id", (req, res) => {
  const { nombre, telefono, cantidad, concepto, precio_unitario, precio_total } = req.body;
  
  const sql = `UPDATE proveedor 
               SET nombre = ?, telefono = ?, cantidad = ?, concepto = ?, 
                   precio_unitario = ?, precio_total = ?
               WHERE id_proveedor = ?`;
  
  db.run(sql, [nombre, telefono, cantidad, concepto, precio_unitario, precio_total, req.params.id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    
    db.get("SELECT * FROM proveedor WHERE id_proveedor = ?", [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  });
});



// -------------------------
// ENDPOINTS PARA HISTORIAL VENTAS
// -------------------------




// JOIN PARA EL DETALLE
app.get("/api/ventas-detalle", (req, res) => {
  const sql = `
    SELECT 
      v.id_venta,
      v.fecha,
      v.hora,
      c.nombre AS cliente,
      c.ci_nit,
      v.metodo_pago,
      v.total,
      GROUP_CONCAT(p.nombre_prod || ' x' || dv.cantidad, ', ') AS productos
    FROM venta v
    LEFT JOIN cliente c ON v.id_cliente = c.cod_cli
    INNER JOIN detalle_venta dv ON dv.id_venta = v.id_venta
    INNER JOIN producto p ON dv.id_producto = p.id_producto
    GROUP BY v.id_venta, v.fecha, v.hora, c.nombre, c.ci_nit, v.metodo_pago, v.total
    ORDER BY v.fecha DESC, v.hora DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if(err){
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});


// -------------------------
// ENDPOINTS PARA LABORATORIO
// -------------------------

// GET Obtener todos los laboratorios
app.get("/api/laboratorios", (req, res) => {
  const sql = "SELECT * FROM laboratorio";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET Obtener un laboratorio por ID
app.get("/api/laboratorios/:id", (req, res) => {
  const sql = "SELECT * FROM laboratorio WHERE id_lab = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// POST crear un nuevo laboratorio
app.post("/api/laboratorios", (req, res) => {
  const { nombre_labo, direccion } = req.body;

  if (!nombre_labo || !direccion) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  const sql = `INSERT INTO laboratorio (nombre_labo, direccion)
               VALUES (?, ?)`;

  db.run(sql, [nombre_labo, direccion], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: {
        id_lab: this.lastID,
        nombre_labo,
        direccion,
      },
    });
  });
});

// PUT actualizar laboratorio
app.put("/api/laboratorios/:id", (req, res) => {
  const { nombre_labo, direccion } = req.body;

  const sql = `UPDATE laboratorio 
               SET nombre_labo = ?, direccion = ?
               WHERE id_lab = ?`;

  db.run(sql, [nombre_labo, direccion, req.params.id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    db.get("SELECT * FROM laboratorio WHERE id_lab = ?", [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  });
});

// DELETE laboratorio
app.delete("/api/laboratorios/:id", (req, res) => {
  const sql = "DELETE FROM laboratorio WHERE id_lab = ?";

  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      data: {
        message: "Laboratorio eliminado correctamente",
        changes: this.changes,
      },
    });
  });
});
// ----------------------
// ENDPOINTS PARA PRODUCTOS
// ----------------------

// GET todos los productos
app.get("/api/productos", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      l.nombre_labo as laboratorio_nombre,
      pr.nombre as proveedor_nombre
    FROM producto p
    LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
    LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET producto por ID
app.get("/api/productos/:id", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      l.nombre_labo as laboratorio_nombre,
      pr.nombre as proveedor_nombre
    FROM producto p
    LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
    LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
    WHERE p.id_producto = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// POST crear producto
app.post("/api/productos", (req, res) => {
  const {
    nombre_prod,
    lote,
    fecha_exp,
    porcentaje_g,
    stock,
    presentacion,
    precio_venta,
    precio_compra,
    valor_medida,
    id_lab,
    id_proveedor
  } = req.body;
  
  const estado = 'activo';
  
  const sql = `
    INSERT INTO producto (
      nombre_prod, lote, fecha_exp, porcentaje_g, stock, 
      presentacion, precio_venta, precio_compra, valor_medida, 
      estado, id_lab, id_proveedor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [
    nombre_prod, lote, fecha_exp, porcentaje_g, stock,
    presentacion, precio_venta, precio_compra, valor_medida,
    estado, id_lab, id_proveedor
  ], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: { 
        id_producto: this.lastID,
        nombre_prod, lote, fecha_exp, porcentaje_g, stock,
        presentacion, precio_venta, precio_compra, valor_medida,
        estado, id_lab, id_proveedor
      }
    });
  });
});

// PUT actualizar producto
app.put("/api/productos/:id", (req, res) => {
  const {
    nombre_prod,
    lote,
    fecha_exp,
    porcentaje_g,
    stock,
    presentacion,
    precio_venta,
    precio_compra,
    valor_medida,
    estado,
    id_lab,
    id_proveedor
  } = req.body;
  
  const sql = `
    UPDATE producto 
    SET 
      nombre_prod = ?, lote = ?, fecha_exp = ?, porcentaje_g = ?, 
      stock = ?, presentacion = ?, precio_venta = ?, precio_compra = ?, 
      valor_medida = ?, estado = ?, id_lab = ?, id_proveedor = ?
    WHERE id_producto = ?
  `;
  
  db.run(sql, [
    nombre_prod, lote, fecha_exp, porcentaje_g, stock,
    presentacion, precio_venta, precio_compra, valor_medida,
    estado, id_lab, id_proveedor, req.params.id
  ], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    
    // Obtener el producto actualizado
    db.get(`
      SELECT 
        p.*,
        l.nombre_labo as laboratorio_nombre,
        pr.nombre as proveedor_nombre
      FROM producto p
      LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
      LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_producto = ?
    `, [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  });
});

// DELETE producto (eliminación suave)
app.delete("/api/productos/:id", (req, res) => {
  const sql = "UPDATE producto SET estado = 'desactivado' WHERE id_producto = ?";
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ 
      data: { 
        message: 'Producto desactivado correctamente',
        changes: this.changes 
      } 
    });
  });
});

// ----------------------
// ENDPOINTS PARA DASHBOARD - DATOS REALES
// ----------------------

// 1. MÉTRICAS HOY VS AYER - CORREGIDO CON HORA LOCAL
app.get("/api/dashboard/metricas-hoy", (req, res) => {
  // Obtener fechas en hora local
  const ahora = new Date();
  const hoy = ahora.toISOString().split('T')[0];
  
  const ayer = new Date(ahora);
  ayer.setDate(ayer.getDate() - 1);
  const ayerStr = ayer.toISOString().split('T')[0];

  const sql = `
    SELECT 
      -- HOY
      (SELECT COALESCE(SUM(total), 0) FROM venta WHERE fecha = ?) as totalHoy,
      (SELECT COALESCE(SUM(dv.cantidad), 0) 
       FROM venta v 
       JOIN detalle_venta dv ON v.id_venta = dv.id_venta 
       WHERE v.fecha = ?) as productosHoy,
      (SELECT COUNT(*) FROM venta WHERE fecha = ?) as ventasHoy,
      
      -- AYER
      (SELECT COALESCE(SUM(total), 0) FROM venta WHERE fecha = ?) as totalAyer,
      (SELECT COALESCE(SUM(dv.cantidad), 0) 
       FROM venta v 
       JOIN detalle_venta dv ON v.id_venta = dv.id_venta 
       WHERE v.fecha = ?) as productosAyer,
      (SELECT COUNT(*) FROM venta WHERE fecha = ?) as ventasAyer
  `;

  db.get(sql, [hoy, hoy, hoy, ayerStr, ayerStr, ayerStr], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// 2. PRODUCTOS CON STOCK BAJO (≤ 10)
app.get("/api/dashboard/productos-stock-bajo", (req, res) => {
  const sql = `
    SELECT 
      p.id_producto as id,
      p.nombre_prod as nombre,
      p.stock,
      COALESCE(l.nombre_labo, 'Sin laboratorio') as laboratorio,
      CASE 
        WHEN p.stock <= 3 THEN 'Crítico'
        WHEN p.stock <= 10 THEN 'Bajo' 
        ELSE 'Bueno'
      END as estado
    FROM producto p
    LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
    WHERE p.stock <= 10 AND p.estado = 'activo'
    ORDER BY p.stock ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// 3. PRODUCTOS PRÓXIMOS A VENCER (≤ 30 días) - CORREGIDO CON HORA LOCAL
app.get("/api/dashboard/productos-por-vencer", (req, res) => {
  // Obtener fecha actual en hora local
  const ahora = new Date();
  const hoy = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
  
  const sql = `
    SELECT 
      p.id_producto as id,
      p.nombre_prod as nombre,
      COALESCE(l.nombre_labo, 'Sin laboratorio') as laboratorio,
      p.fecha_exp as fechaVencimiento,
      -- Calcular días restantes usando fecha local
      JULIANDAY(p.fecha_exp) - JULIANDAY(?) as diasRestantes
    FROM producto p
    LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
    WHERE p.fecha_exp IS NOT NULL 
      AND p.estado = 'activo'
      AND JULIANDAY(p.fecha_exp) - JULIANDAY(?) BETWEEN 0 AND 30
    ORDER BY diasRestantes ASC
  `;

  db.all(sql, [hoy, hoy], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    
    const productos = rows.map(p => ({
      ...p,
      diasRestantes: Math.ceil(p.diasRestantes)
    }));
    
    res.json({ data: productos });
  });
});
// 4. VENTAS MENSUALES PARA GRÁFICA - CORREGIDO CON HORA LOCAL
app.get("/api/dashboard/ventas-mensuales", (req, res) => {
  // Obtener año actual en hora local
  const añoActual = new Date().getFullYear();
  
  const sql = `
    SELECT 
      strftime('%m', fecha) as mes_numero,
      CASE strftime('%m', fecha)
        WHEN '01' THEN 'Ene' WHEN '02' THEN 'Feb' WHEN '03' THEN 'Mar'
        WHEN '04' THEN 'Abr' WHEN '05' THEN 'May' WHEN '06' THEN 'Jun'
        WHEN '07' THEN 'Jul' WHEN '08' THEN 'Ago' WHEN '09' THEN 'Sep'
        WHEN '10' THEN 'Oct' WHEN '11' THEN 'Nov' WHEN '12' THEN 'Dic'
      END as mes,
      COALESCE(SUM(total), 0) as ventas,
      COALESCE(SUM(
        (SELECT SUM(cantidad) FROM detalle_venta dv WHERE dv.id_venta = v.id_venta)
      ), 0) as productos,
      COUNT(*) as nroVentas
    FROM venta v
    WHERE strftime('%Y', fecha) = ?
    GROUP BY strftime('%m', fecha)
    ORDER BY mes_numero ASC
  `;

  db.all(sql, [añoActual.toString()], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// 5. TOP PRODUCTOS MÁS VENDIDOS
app.get("/api/dashboard/top-productos", (req, res) => {
  const sql = `
    SELECT 
      p.nombre_prod as nombre,
      p.presentacion as categoria,
      COALESCE(SUM(dv.cantidad), 0) as ventas
    FROM producto p
    LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto
    LEFT JOIN venta v ON dv.id_venta = v.id_venta
    WHERE v.fecha >= date('now', '-30 days')  -- Últimos 30 días
    GROUP BY p.id_producto, p.nombre_prod, p.presentacion
    HAVING ventas > 0
    ORDER BY ventas DESC
    LIMIT 15
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Redirigir "/" a "/api/clientes"
app.get("/", (req, res) => {
  res.redirect("/api/proveedores");
});


// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));

// ----------------------
// ENDPOINTS PARA PRODUCTOS
// ----------------------

// GET todos los productos
app.get("/api/productos", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      l.nombre_labo as laboratorio_nombre,
      pr.nombre as proveedor_nombre
    FROM producto p
    LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
    LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// GET producto por ID
app.get("/api/productos/:id", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      l.nombre_labo as laboratorio_nombre,
      pr.nombre as proveedor_nombre
    FROM producto p
    LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
    LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
    WHERE p.id_producto = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// POST crear producto
app.post("/api/productos", (req, res) => {
  const {
    nombre_prod,
    lote,
    fecha_exp,
    porcentaje_g,
    stock,
    presentacion,
    precio_venta,
    precio_compra,
    valor_medida,
    id_lab,
    id_proveedor
  } = req.body;
  
  const estado = 'activo';
  
  const sql = `
    INSERT INTO producto (
      nombre_prod, lote, fecha_exp, porcentaje_g, stock, 
      presentacion, precio_venta, precio_compra, valor_medida, 
      estado, id_lab, id_proveedor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [
    nombre_prod, lote, fecha_exp, porcentaje_g, stock,
    presentacion, precio_venta, precio_compra, valor_medida,
    estado, id_lab, id_proveedor
  ], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      data: { 
        id_producto: this.lastID,
        nombre_prod, lote, fecha_exp, porcentaje_g, stock,
        presentacion, precio_venta, precio_compra, valor_medida,
        estado, id_lab, id_proveedor
      }
    });
  });
});

// PUT actualizar producto
app.put("/api/productos/:id", (req, res) => {
  const {
    nombre_prod,
    lote,
    fecha_exp,
    porcentaje_g,
    stock,
    presentacion,
    precio_venta,
    precio_compra,
    valor_medida,
    estado,
    id_lab,
    id_proveedor
  } = req.body;
  
  const sql = `
    UPDATE producto 
    SET 
      nombre_prod = ?, lote = ?, fecha_exp = ?, porcentaje_g = ?, 
      stock = ?, presentacion = ?, precio_venta = ?, precio_compra = ?, 
      valor_medida = ?, estado = ?, id_lab = ?, id_proveedor = ?
    WHERE id_producto = ?
  `;
  
  db.run(sql, [
    nombre_prod, lote, fecha_exp, porcentaje_g, stock,
    presentacion, precio_venta, precio_compra, valor_medida,
    estado, id_lab, id_proveedor, req.params.id
  ], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    
    // Obtener el producto actualizado
    db.get(`
      SELECT 
        p.*,
        l.nombre_labo as laboratorio_nombre,
        pr.nombre as proveedor_nombre
      FROM producto p
      LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
      LEFT JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_producto = ?
    `, [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  });
});

// DELETE producto (eliminación suave)
app.delete("/api/productos/:id", (req, res) => {
  const sql = "UPDATE producto SET estado = 'desactivado' WHERE id_producto = ?";
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ 
      data: { 
        message: 'Producto desactivado correctamente',
        changes: this.changes 
      } 
    });
  });
});
