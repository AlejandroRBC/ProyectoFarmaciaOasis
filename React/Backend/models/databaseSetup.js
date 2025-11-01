
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
    medida TEXT,
    estado TEXT,
    id_lab INTEGER,
    FOREIGN KEY (id_lab) REFERENCES laboratorio(id_lab)
  )`);

  // VENTA
  db.run(`CREATE TABLE IF NOT EXISTS venta (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE DEFAULT (DATE('now','localtime')),
    hora TIME DEFAULT (TIME('now','localtime')),
    total REAL,
    metodo_pago TEXT,
    id_cliente INTEGER,
    descuento REAL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(cod_cli)
  )`);

  // DETALLE_VENTA
  db.run(`CREATE TABLE IF NOT EXISTS detalle_venta (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER,
    id_producto INTEGER,
    cantidad INTEGER,
    descuento REAL,
    subtotal REAL,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
  )`);

  // Historial Ingresos_Egresos
  db.run(`CREATE TABLE IF NOT EXISTS Historial_Ingresos_Egresos (
    id_hie INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER,
    nombre TEXT,
    presentacion TEXT,
    medida TEXT,
    lote TEXT,
    precio_venta REAL,
    stock_antiguo INTEGER,
    stock_nuevo INTEGER,
    fecha DATE DEFAULT (DATE('now','localtime')),
    hora TIME DEFAULT (TIME('now','localtime')),
    laboratorio TEXT
  )`);

  // TRIGGERS
  // TRIGGERS
  db.serialize(() => {
    // Eliminar triggers antiguos
    db.run(`DROP TRIGGER IF EXISTS registrar_movimiento_venta`);
    db.run(`DROP TRIGGER IF EXISTS registrar_egreso_stock`);
    db.run(`DROP TRIGGER IF EXISTS registrar_ingreso_producto_nuevo`);
    db.run(`DROP TRIGGER IF EXISTS registrar_ingreso_actualizacion_stock`);

    // ✅ TRIGGER PARA VENTAS - SOLO REGISTRA, NO ACTUALIZA STOCK
    // El controlador ya actualiza el stock manualmente
    db.run(`CREATE TRIGGER IF NOT EXISTS registrar_movimiento_venta
      AFTER INSERT ON detalle_venta
      FOR EACH ROW
      BEGIN
        -- Registrar el movimiento (solo registro, no actualiza stock)
        INSERT INTO Historial_Ingresos_Egresos (
          id_producto,
          nombre,
          presentacion,
          medida,
          lote,
          precio_venta,
          stock_antiguo,
          stock_nuevo,
          laboratorio,
          fecha,
          hora
        )
        SELECT
          p.id_producto,
          p.nombre_prod,
          p.presentacion,
          p.medida,
          p.lote,
          p.precio_venta,
          p.stock + NEW.cantidad,  -- stock antes de la venta
          p.stock,                 -- stock actual (ya reducido)
          l.nombre_labo,
          DATE('now','localtime'),
          TIME('now','localtime')
        FROM producto p
        LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
        WHERE p.id_producto = NEW.id_producto;
    
       
      END;
    `);
    // 🔹 Trigger para eliminar duplicado reciente de egreso (venta)
db.run(`CREATE TRIGGER IF NOT EXISTS limpiar_duplicado_venta
  AFTER INSERT ON Historial_Ingresos_Egresos
  FOR EACH ROW
  WHEN NEW.stock_nuevo < NEW.stock_antiguo  -- Solo egresos (ventas)
  BEGIN
    DELETE FROM Historial_Ingresos_Egresos
    WHERE id_hie < NEW.id_hie
      AND id_producto = NEW.id_producto
      AND stock_antiguo = NEW.stock_antiguo
      AND stock_nuevo = NEW.stock_nuevo
      AND ABS(strftime('%s', datetime(fecha || ' ' || hora)) - strftime('%s', datetime('now','localtime'))) <= 2;
  END;
`);

    

    // ✅ TRIGGER PARA NUEVO PRODUCTO (INGRESO)
    db.run(`CREATE TRIGGER registrar_ingreso_producto_nuevo
      AFTER INSERT ON producto
      FOR EACH ROW
      BEGIN
        INSERT INTO Historial_Ingresos_Egresos (
          id_producto,
          nombre,
          presentacion,
          medida,
          lote,
          precio_venta,
          stock_antiguo,
          stock_nuevo,
          laboratorio
        )
        SELECT
          NEW.id_producto,
          NEW.nombre_prod,
          NEW.presentacion,
          NEW.medida,
          NEW.lote,
          NEW.precio_venta,
          0,
          NEW.stock,
          l.nombre_labo
        FROM laboratorio l
        WHERE l.id_lab = NEW.id_lab;
      END;
    `);

    // ✅ TRIGGER PARA MODIFICACIONES DE STOCK (INGRESOS Y EGRESOS MANUALES)
    // Este se ejecuta cuando se modifica el stock desde el inventario
    db.run(`CREATE TRIGGER IF NOT EXISTS registrar_cambio_stock
      AFTER UPDATE ON producto
      FOR EACH ROW
      WHEN NEW.stock != OLD.stock 
      BEGIN
        INSERT INTO Historial_Ingresos_Egresos (
          id_producto,
          nombre,
          presentacion,
          medida,
          lote,
          precio_venta,
          stock_antiguo,
          stock_nuevo,
          laboratorio
        )
        SELECT
          NEW.id_producto,
          NEW.nombre_prod,
          NEW.presentacion,
          NEW.medida,
          NEW.lote,
          NEW.precio_venta,
          OLD.stock,
          NEW.stock,
          l.nombre_labo
        FROM laboratorio l
        WHERE l.id_lab = NEW.id_lab;
      END;
    `);
    // ✅ TRIGGER 4: LIMPIAR DUPLICADOS DE VENTAS (NUEVO)
    // Este trigger elimina el último registro duplicado cuando se hace una venta
    // db.run(`CREATE TRIGGER IF NOT EXISTS limpiar_duplicado_hist
    //   AFTER INSERT ON Historial_Ingresos_Egresos
    //   FOR EACH ROW
    //   BEGIN
    //     DELETE FROM Historial_Ingresos_Egresos
    //     WHERE id_hie NOT IN (
    //       SELECT MAX(id_hie)
    //       FROM Historial_Ingresos_Egresos
    //       WHERE id_producto = NEW.id_producto
    //         AND datetime(fecha || ' ' || hora) > datetime('now', '-2 seconds')
    //         AND stock_nuevo < stock_antiguo
    //     )
    //     AND id_producto = NEW.id_producto
    //     AND datetime(fecha || ' ' || hora) > datetime('now', '-2 seconds')
    //     AND stock_nuevo < stock_antiguo;
    //   END;
    // `);
    

    // ✅ TRIGGER PARA DESACTIVAR PRODUCTO CUANDO STOCK = 0
    db.run(`CREATE TRIGGER IF NOT EXISTS desactivar_producto_stock_cero
      AFTER UPDATE ON producto
      FOR EACH ROW
      WHEN NEW.stock = 0 AND OLD.stock > 0 AND NEW.estado = 'activo'
      BEGIN
        UPDATE producto 
        SET estado = 'desactivado' 
        WHERE id_producto = NEW.id_producto;
      END;
    `);
  });
};

const verificarProductosAlIniciar = () => {
  console.log('🔍 Verificando productos al iniciar servidor...');
  
  const sqlStockCero = `
    UPDATE producto 
    SET estado = 'desactivado' 
    WHERE stock = 0 AND estado = 'activo'
  `;
  
  db.run(sqlStockCero);
  
  const sqlVencidos = `
    UPDATE producto 
    SET estado = 'desactivado' 
    WHERE fecha_exp IS NOT NULL 
      AND DATE(fecha_exp) < DATE('now','localtime') 
      AND estado = 'activo'
  `;
  
  db.run(sqlVencidos);
  
  const sqlProximosVencer = `
    SELECT COUNT(*) as count
    FROM producto 
    WHERE fecha_exp IS NOT NULL 
      AND DATE(fecha_exp) BETWEEN DATE('now','localtime') AND DATE('now','localtime','+30 days')
      AND estado = 'activo'
  `;
  
  db.get(sqlProximosVencer);
};

module.exports = { createTables, verificarProductosAlIniciar };