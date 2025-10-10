import { useState, useEffect } from 'react';

// Datos de ejemplo
const productosMock = [
  {
    id: 1,
    codigo: '1',
    lote: '12345',
    nombre: 'Ibuprofeno',
    presentacion: 'Tabletas',
    precio_base: 10,
    precio_venta: 15,
    stock: 50,
    fecha_expiracion: '2025-12-31',
    laboratorio: 'Lab Farma',
    porcentaje_g: 50
  },
  {
    id: 2,
    codigo: '2',
    lote: '67890',
    nombre: 'Paracetamol',
    presentacion: 'Jarabe',
    precio_base: 8,
    precio_venta: 12,
    stock: 30,
    fecha_expiracion: '2025-08-20',
    laboratorio: 'Lab Salud',
    porcentaje_g: 50
  }
];

const laboratoriosMock = [
  { id: 1, nombre: 'Lab Farma', direccion: 'Av. Principal 123' },
  { id: 2, nombre: 'Lab Salud', direccion: 'Calle Secundaria 456' }
];

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setProductos(productosMock);
      setLaboratorios(laboratoriosMock);
      setLoading(false);
    },500);
  }, []);

  const agregarProducto = (nuevoProducto) => {
    const id = Math.max(...productos.map(p => p.id)) + 1;
    setProductos(prev => [...prev, { ...nuevoProducto, id }]);
  };

  const actualizarProducto = (id, datosActualizados) => {
    setProductos(prev => prev.map(p => 
      p.id === id ? { ...p, ...datosActualizados } : p
    ));
  };

  const eliminarProducto = (id) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const agregarLaboratorio = (nuevoLab) => {
    const id = Math.max(...laboratorios.map(l => l.id)) + 1;
    setLaboratorios(prev => [...prev, { ...nuevoLab, id }]);
  };

  return {
    productos,
    laboratorios,
    loading,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    agregarLaboratorio
  };
};