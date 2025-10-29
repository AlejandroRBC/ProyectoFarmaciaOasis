import { useState } from 'react';
import ventasService from '../services/VentasServices';

export const useCarrito = () => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const modificarCantidad = (id, cambio) => {
    setCarrito(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          if (nuevaCantidad < 1) return null;
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // ✅ NUEVA FUNCIÓN PARA REALIZAR VENTA EN BACKEND
  const realizarVenta = async (datosCliente) => {
    try {
      // Preparar datos para el backend
      const ventaData = {
        cliente: datosCliente.ci_nit !== '00000' ? datosCliente.ci_nit : null,
        metodo_pago: datosCliente.metodo_pago,
        productos: carrito.map(item => ({
          id: item.id,
          cantidad: item.cantidad,
          precio: item.precio_venta
        }))
      };

      // Llamar al servicio
      const resultado = await ventasService.crearVenta(ventaData);
      
      // Vaciar carrito después de venta exitosa
      vaciarCarrito();
      
      return resultado;
    } catch (error) {
      console.error('Error al realizar venta:', error);
      throw error;
    }
  };

  const totalVenta = carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);

  return {
    carrito,
    agregarAlCarrito,
    modificarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    realizarVenta, // ✅ Exportar la nueva función
    totalVenta
  };
};