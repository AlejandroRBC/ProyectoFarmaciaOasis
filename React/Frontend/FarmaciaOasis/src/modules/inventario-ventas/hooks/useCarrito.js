import { useState } from 'react';
import ventasService from '../services/VentasServices';

export const useCarrito = (productos, actualizarStockProducto,recargarProductos) => {
  const [carrito, setCarrito] = useState([]);

  // ✅ Verificar si hay stock disponible
  const hayStockDisponible = (producto, cantidadDeseada = 1) => {
    const productoEnInventario = productos.find(p => p.id === producto.id);
    const cantidadEnCarrito = carrito.find(item => item.id === producto.id)?.cantidad || 0;
    const stockDisponible = (productoEnInventario?.stock || 0) - cantidadEnCarrito;
    return stockDisponible >= cantidadDeseada;
  };

  // ✅ Obtener stock disponible para un producto
  const obtenerStockDisponible = (productoId) => {
    const productoEnInventario = productos.find(p => p.id === productoId);
    const cantidadEnCarrito = carrito.find(item => item.id === productoId)?.cantidad || 0;
    return (productoEnInventario?.stock || 0) - cantidadEnCarrito;
  };

  const agregarAlCarrito = (producto) => {
    // ✅ Verificar stock antes de agregar
    if (!hayStockDisponible(producto)) {
      alert(`❌ No hay suficiente stock de ${producto.nombre}. Stock disponible: ${obtenerStockDisponible(producto.id)}`);
      return;
    }

    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        // ✅ Verificar stock para aumentar cantidad
        if (!hayStockDisponible(producto, existe.cantidad + 1)) {
          alert(`❌ No hay suficiente stock de ${producto.nombre}. Stock disponible: ${obtenerStockDisponible(producto.id)}`);
          return prev;
        }
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
          
          // ✅ Validar que no sea menor a 1
          if (nuevaCantidad < 1) return null;
          
          // ✅ Validar stock disponible
          const producto = productos.find(p => p.id === id);
          if (producto && !hayStockDisponible(producto, nuevaCantidad)) {
            alert(`❌ No hay suficiente stock. Stock disponible: ${obtenerStockDisponible(id)}`);
            return item; // Mantener cantidad actual
          }
          
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
  
      console.log('Enviando venta al backend:', ventaData);
  
      // Llamar al servicio
      const resultado = await ventasService.crearVenta(ventaData);
      
      // ✅ GUARDAR LOS DATOS COMPLETOS DE LA VENTA PARA EL PDF
      const ventaCompleta = {
        ...resultado,
        datosCliente: datosCliente,
        productosVendidos: carrito.map(item => ({
          ...item,
          subtotal: item.precio_venta * item.cantidad
        }))
      };
      
      // Recargar productos desde la base de datos
      if (recargarProductos) {
        console.log('Recargando productos desde BD...');
        await recargarProductos();
      }
      
      // Vaciar carrito después de venta exitosa
      vaciarCarrito();
      
      console.log('Venta realizada exitosamente:', ventaCompleta);
      return ventaCompleta; // ✅ Retornar datos completos
      
    } catch (error) {
      console.error('Error al realizar venta:', error);
      
      if (error.message.includes('stock') || error.message.includes('Stock')) {
        if (recargarProductos) {
          console.log('Error de stock, recargando productos...');
          await recargarProductos();
        }
      }
      
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
    realizarVenta,
    totalVenta,
    hayStockDisponible, 
    obtenerStockDisponible 
  };
};