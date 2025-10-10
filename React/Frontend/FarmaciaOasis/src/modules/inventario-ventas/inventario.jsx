import { useState } from 'react';
import { useProductos } from './hooks/useProductos';
import { useCarrito } from './hooks/useCarrito';
import { useModales } from './hooks/useModales'; 
import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';
import LaboratorioForm from './components/LaboratorioForm';
import VentaForm from './components/VentaForm';
import Modal from './components/Modal.jsx';
import './inventario.css';

function Inventario() {
  const {
    productos,
    laboratorios,
    loading,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    agregarLaboratorio
  } = useProductos();

  const {
    carrito,
    agregarAlCarrito,
    modificarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalVenta
  } = useCarrito();

  const {
    modalProducto,
    modalLaboratorio,
    modalVenta,
    abrirModalProducto,
    cerrarModalProducto,
    abrirModalLaboratorio,
    cerrarModalLaboratorio,
    abrirModalVenta,
    cerrarModalVenta
  } = useModales();

  const [busqueda, setBusqueda] = useState('');

  // Filtrar productos basado en búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.includes(busqueda)
  );

  const handleRealizarVenta = (datosCliente) => {
    console.log('Venta realizada:', { datosCliente, carrito, totalVenta });
    alert(`Venta realizada exitosamente!\nTotal: ${totalVenta} Bs\nCliente: ${datosCliente.nombre}`);
    vaciarCarrito();
    cerrarModalVenta();
  };

  const handleSubmitProducto = (datos) => {
    if (modalProducto.producto) {
      actualizarProducto(modalProducto.producto.id, datos);
    } else {
      agregarProducto(datos);
    }
    cerrarModalProducto();
  };

  if (loading) {
    return <div className="cargando">Cargando inventario...</div>;
  }

  return (
    <div className="inventario-container">
      <h1>INVENTARIO</h1>
      
      {/* Barra superior */}
      <div className="inventario-header">
        <div className="busqueda-container">
          <input 
            className="busqueda" 
            type="text" 
            placeholder="¿Qué estás buscando?"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button>Buscar</button>
        </div>
        <div className="carrito-info">
          <button 
            className="btn-carrito"
            onClick={abrirModalVenta}
          >
            🛒 Carrito ({carrito.reduce((total, item) => total + item.cantidad, 0)})
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <ProductoList 
        productos={productosFiltrados}
        onAgregarCarrito={agregarAlCarrito}
        onEditar={abrirModalProducto} 
        onEliminar={eliminarProducto}
      />
  
      {/* Botones de acción */}
      <div className="acciones-inventario">
        <button 
          className="btn-primario"
          onClick={() => abrirModalProducto()}
        >
          ➕ Agregar Producto
        </button>
        <button 
          className="btn-secundario"
          onClick={abrirModalLaboratorio}
        >
          🏭 Agregar Laboratorio
        </button>
      </div>

      {/* Modal Agregar/Editar Producto */}
      {modalProducto.abierto && (
        <Modal 
          titulo={modalProducto.producto ? "Editar Producto" : "Agregar Nuevo Producto"}
          onClose={cerrarModalProducto}
        >
          <ProductoForm
            laboratorios={laboratorios}
            producto={modalProducto.producto}
            onSubmit={handleSubmitProducto}
            onCancel={cerrarModalProducto}
          />
        </Modal>
      )}

      {/* Modal Agregar Laboratorio */}
      {modalLaboratorio && (
        <Modal 
          titulo="Agregar Nuevo Laboratorio"
          onClose={cerrarModalLaboratorio}
        >
          <LaboratorioForm
            onSubmit={(datosLaboratorio) => {
              agregarLaboratorio(datosLaboratorio);
              cerrarModalLaboratorio();
            }}
            onCancel={cerrarModalLaboratorio}
          />
        </Modal>
      )}

      {/* Modal Venta */}
      {modalVenta && (
        <Modal 
          titulo="Realizar Venta"
          tamaño="grande"
          onClose={cerrarModalVenta}
        >
          <VentaForm
            carrito={carrito}
            totalVenta={totalVenta}
            onModificarCantidad={modificarCantidad}
            onEliminarItem={eliminarDelCarrito}
            onVaciarCarrito={vaciarCarrito}
            onRealizarVenta={handleRealizarVenta}
            onCancel={cerrarModalVenta}
          />
        </Modal>
      )}
    </div>
  );
}

export default Inventario;