const db = require("../config/database");

const createTables = () => {
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
    fecha_exp DATE,
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
    fecha DATE DEFAULT (DATE('now','localtime')),
    hora TIME DEFAULT (TIME('now','localtime')),
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

  // Historial Ingresos_Egresos
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

  // TRIGGER
  db.serialize(() => {
  db.run(`DROP TRIGGER IF EXISTS registrar_movimiento_venta`);
  db.run(`CREATE TRIGGER registrar_movimiento_venta
    AFTER INSERT ON detalle_venta
    FOR EACH ROW
    BEGIN
      -- Insertar movimiento en historial
      INSERT INTO Historial_Ingresos_Egresos (
        nombre,
        presentacion,
        lote,
        precio_venta,
        stock_antiguo,
        stock_nuevo,
        laboratorio,
        fecha,
        hora
      )
      VALUES (
        (SELECT nombre_prod FROM producto WHERE id_producto = NEW.id_producto),
        (SELECT presentacion FROM producto WHERE id_producto = NEW.id_producto),
        (SELECT lote FROM producto WHERE id_producto = NEW.id_producto),
        (SELECT precio_venta FROM producto WHERE id_producto = NEW.id_producto),
        (SELECT stock FROM producto WHERE id_producto = NEW.id_producto),
        (SELECT stock - NEW.cantidad FROM producto WHERE id_producto = NEW.id_producto),
        (SELECT nombre_labo FROM laboratorio WHERE id_lab = (SELECT id_lab FROM producto WHERE id_producto = NEW.id_producto)),
        DATE('now','localtime'),
        TIME('now','localtime')
      );

      -- Actualizar stock
      UPDATE producto
      SET stock = stock - NEW.cantidad
      WHERE id_producto = NEW.id_producto;
    END;`
      );
  // trigger para los egresos (salida de productos)
  db.run(`DROP TRIGGER IF EXISTS registrar_egreso_stock`);
  db.run(`CREATE TRIGGER registrar_egreso_stock
  AFTER UPDATE ON producto
  FOR EACH ROW
  WHEN NEW.stock < OLD.stock
  BEGIN
    INSERT INTO Historial_Ingresos_Egresos (
      nombre,
      presentacion,
      lote,
      precio_venta,
      stock_antiguo,
      stock_nuevo,
      laboratorio,
      fecha,
      hora
    )
    VALUES (
      NEW.nombre_prod,
      NEW.presentacion,
      NEW.lote,
      NEW.precio_venta,
      OLD.stock,
      NEW.stock,
      (SELECT nombre_labo FROM laboratorio WHERE id_lab = NEW.id_lab),
      DATE('now','localtime'),
      TIME('now','localtime')
    );
  END;`);

  });

    // Trigger para nuevo producto (ingreso)
  db.run(`CREATE TRIGGER IF NOT EXISTS registrar_ingreso_producto_nuevo
    AFTER INSERT ON producto
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
      VALUES (
        NEW.nombre_prod,
        NEW.presentacion,
        NEW.lote,
        NEW.precio_venta,
        0,
        NEW.stock,
        (SELECT nombre_labo FROM laboratorio WHERE id_lab = NEW.id_lab)
      );
    END;`);

  // Trigger para actualización de stock (solo aumentos) (ingreso)
  db.run(`CREATE TRIGGER IF NOT EXISTS registrar_ingreso_actualizacion_stock
    AFTER UPDATE ON producto
    FOR EACH ROW
    WHEN NEW.stock > OLD.stock
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
      VALUES (
        NEW.nombre_prod,
        NEW.presentacion,
        NEW.lote,
        NEW.precio_venta,
        OLD.stock,
        NEW.stock,
        (SELECT nombre_labo FROM laboratorio WHERE id_lab = NEW.id_lab)
      );
    END;`);
};
module.exports = { createTables };