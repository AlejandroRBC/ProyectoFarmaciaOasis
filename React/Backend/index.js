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
  precio_total REAL,
  estado TEXT
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
// Insertar datos de ejemplo
// ----------------------
db.serialize(() => {
  db.run(`INSERT INTO laboratorio (nombre_labo, direccion) VALUES 
    ('Laboratorio FarmaPlus', 'Av. Bolívar 123'),
    ('Laboratorio SaludVida', 'Calle Sucre 456')`);

  db.run(`INSERT INTO proveedor (nombre, telefono, cantidad, concepto, precio_unitario, precio_total, estado) VALUES
    ('Distribuidora ABC', '111222333', 50, 'Paracetamol', 2.5, 125, 'activo'),
    ('Suministros XYZ', '444555666', 30, 'Ibuprofeno', 3.0, 90, 'activo')`);

  db.run(`INSERT INTO cliente (nombre, ci_nit, descuento, estado) VALUES
    ('Juan Pérez', '1234567', 5, 'activo'),
    ('María García', '7654321', 10, 'activo')`);

  db.run(`INSERT INTO producto (nombre_prod, lote, fecha_exp, porcentaje_g, stock, presentacion, precio_venta, precio_compra, valor_medida, estado, id_lab, id_proveedor) VALUES
    ('Paracetamol 500mg', 'L001', '2026-05-01', 500, 100, 'Caja x 10', 3.0, 2.5, 500, 'activo', 1, 1),
    ('Ibuprofeno 400mg', 'L002', '2026-12-01', 400, 50, 'Caja x 10', 4.0, 3.0, 400, 'activo', 2, 2)`);

  db.run(`INSERT INTO venta (total, metodo_pago, id_cliente) VALUES
    (30.0, 'efectivo', 1),
    (40.0, 'tarjeta', 2)`);

  db.run(`INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal) VALUES
    (1, 1, 5, 15.0),
    (1, 2, 3, 12.0),
    (2, 1, 10, 30.0)`);
});

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



// Redirigir "/" a "/api/clientes"
app.get("/", (req, res) => {
  res.redirect("/api/clientes");
});

// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));