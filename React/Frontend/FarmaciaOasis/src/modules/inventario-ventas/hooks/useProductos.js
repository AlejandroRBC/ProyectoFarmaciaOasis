import { useState, useEffect } from 'react';
import InventarioService from '../services/InventarioService';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  

  useEffect(() => {
    // Simular carga de datos
      setProductos(productosMock);
      setLaboratorios(laboratoriosMock);
    
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

  const desactivarProducto = (id) => {
    setProductos(prev => prev.map(p => 
      p.id === id ? { ...p, estado: 'desactivado' } : p
    ));
  };

  const reactivarProducto = (id) => {
    setProductos(prev => prev.map(p => 
      p.id === id ? { ...p, estado: 'activado' } : p
    ));
  };

  const agregarLaboratorio = (nuevoLab) => {
    const id = Math.max(...laboratorios.map(l => l.id)) + 1;
    setLaboratorios(prev => [...prev, { ...nuevoLab, id }]);
  };

  return {
    productos,
    laboratorios,
    
    agregarProducto,
    actualizarProducto, 
    desactivarProducto,
    reactivarProducto,
    agregarLaboratorio
  };
};