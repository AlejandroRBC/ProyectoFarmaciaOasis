import { useState } from 'react';
import { useProductos } from './hooks/useProductos';
import { useCarrito } from './hooks/useCarrito';
import ProductoList from './components/ProductoList';
import Carrito from './components/Carrito';
import ProductoForm from './components/ProductoForm';
import LaboratorioForm from './components/LaboratorioForm';
import VentaForm from './components/VentaForm';
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

  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [mostrarFormLaboratorio, setMostrarFormLaboratorio] = useState(false);
  const [mostrarVenta, setMostrarVenta] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
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
    setMostrarVenta(false);
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
            onClick={() => setMostrarVenta(true)}
          >
            🛒 Carrito ({carrito.reduce((total, item) => total + item.cantidad, 0)})
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <ProductoList 
        productos={productosFiltrados}
        onAgregarCarrito={agregarAlCarrito}
        onEditar={setProductoEditando}
        onEliminar={eliminarProducto}
      />

      {/* Botones de acción */}
      <div className="acciones-inventario">
        <button 
          className="btn-primario"
          onClick={() => setMostrarFormProducto(true)}
        >
          ➕ Agregar Producto
        </button>
        <button 
          className="btn-secundario"
          onClick={() => setMostrarFormLaboratorio(true)}
        >
          🏭 Agregar Laboratorio
        </button>
      </div>

      {/* Modales/Forms */}
      {mostrarFormProducto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductoForm
              laboratorios={laboratorios}
              producto={productoEditando}
              onSubmit={(datos) => {
                if (productoEditando) {
                  actualizarProducto(productoEditando.id, datos);
                  setProductoEditando(null);
                } else {
                  agregarProducto(datos);
                }
                setMostrarFormProducto(false);
              }}
              onCancel={() => {
                setMostrarFormProducto(false);
                setProductoEditando(null);
              }}
            />
          </div>
        </div>
      )}

      {mostrarFormLaboratorio && (
        <div className="modal-overlay">
          <div className="modal-content">
            <LaboratorioForm
              onSubmit={agregarLaboratorio}
              onCancel={() => setMostrarFormLaboratorio(false)}
            />
          </div>
        </div>
      )}

      {mostrarVenta && (
        <div className="modal-overlay">
          <div className="modal-content grande">
            <VentaForm
              carrito={carrito}
              totalVenta={totalVenta}
              onModificarCantidad={modificarCantidad}
              onEliminarItem={eliminarDelCarrito}
              onVaciarCarrito={vaciarCarrito}
              onRealizarVenta={handleRealizarVenta}
              onCancel={() => setMostrarVenta(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventario;