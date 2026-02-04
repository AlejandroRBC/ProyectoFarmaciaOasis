import { useState } from 'react';
import ventasService from '../services/VentasServices';
import clienteService from '../services/clienteService';
import { saleSound } from '../utils/sounds'; 

export const useCarrito = (productos, actualizarStockProducto, recargarProductos) => {
  const [carrito, setCarrito] = useState([]);
  const [descuentoCliente, setDescuentoCliente] = useState(0);

  /**
   * Verifica si hay stock disponible para un producto
   */
  const hayStockDisponible = (producto, cantidadDeseada = 1) => {
    const productoEnInventario = productos.find(p => p.id === producto.id);
    const cantidadEnCarrito = carrito.find(item => item.id === producto.id)?.cantidad || 0;
    const stockDisponible = (productoEnInventario?.stock || 0) - cantidadEnCarrito;
    return stockDisponible >= cantidadDeseada;
  };

  /**
   * Obtiene el stock disponible considerando el carrito actual
   */
  const obtenerStockDisponible = (productoId) => {
    const productoEnInventario = productos.find(p => p.id === productoId);
    const cantidadEnCarrito = carrito.find(item => item.id === productoId)?.cantidad || 0;
    return (productoEnInventario?.stock || 0) - cantidadEnCarrito;
  };
 
  /**
   * Agrega un producto al carrito con validación de stock
   */
  const agregarAlCarrito = (producto) => {
    const stockDisponible = obtenerStockDisponible(producto.id);
    
    if (stockDisponible < 1) {
      return;
    }

    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        const nuevoStockDisponible = obtenerStockDisponible(producto.id);
        if (nuevoStockDisponible < 1) {
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

  /**
   * Modifica la cantidad de un producto en el carrito
   */
  const modificarCantidad = (id, cambio) => {
    setCarrito(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          
          if (nuevaCantidad < 1) return null;
          
          const stockDisponible = obtenerStockDisponible(id);
          const producto = productos.find(p => p.id === id);
          
          if (nuevaCantidad > (item.cantidad) && stockDisponible < 1) {
            return item;
          }
          
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      }).filter(Boolean)
    );
  };

  /**
   * Elimina un producto específico del carrito
   */
  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Vacía completamente el carrito
   */
  const vaciarCarrito = () => {
    setCarrito([]);
    setDescuentoCliente(0);
  };

  /**
   * Actualiza el porcentaje de descuento aplicado
   */
  const actualizarDescuento = (porcentajeDescuento) => {
    setDescuentoCliente(parseFloat(porcentajeDescuento) || 0);
  };

  /**
   * Procesa la venta completa del carrito
   */
  const realizarVenta = async (datosCliente) => {
    try {
      let idCliente = null;
      let clienteReactivado = false;
      let porcentajeDescuento = 0;
      
      if (datosCliente.ci_nit && datosCliente.ci_nit !== '00000') {
        const clienteExistente = await clienteService.obtenerClientePorCI(datosCliente.ci_nit);
        if (clienteExistente) {
          porcentajeDescuento = clienteExistente.descuento || 0;
          
          if (clienteExistente.estado === 'inactivo') {
            clienteReactivado = true;
          }
        }
        
        idCliente = await clienteService.buscarOCrearCliente(
          datosCliente.nombre,
          datosCliente.ci_nit,
          porcentajeDescuento
        );
      }

      const ventaData = {
        cliente: idCliente,
        metodo_pago: datosCliente.metodo_pago,
        productos: carrito.map(item => ({
          id: item.id,
          cantidad: item.cantidad,
          precio: item.precio_venta
        }))
      };

      const resultado = await ventasService.crearVenta(ventaData);
      saleSound.play();

      const ventaCompleta = {
        ...resultado,
        datosCliente: datosCliente,
        clienteReactivado: clienteReactivado,
        productosVendidos: carrito.map(item => ({
          ...item,
          subtotal: item.precio_venta * item.cantidad
        })),
        total: resultado.total,
        total_sin_descuento: resultado.total_sin_descuento,
        descuento_aplicado: resultado.descuento_aplicado,
        porcentaje_descuento: resultado.porcentaje_descuento
      };
      
      if (recargarProductos) {
        await recargarProductos();
      }
      
      vaciarCarrito();
      
      return ventaCompleta;
      
    } catch (error) {
      if (error.message.includes('stock') || error.message.includes('Stock')) {
        if (recargarProductos) {
          await recargarProductos();
        }
      }
      
      throw error;
    }
  };

  const totalSinDescuento = carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);
  const montoDescuento = totalSinDescuento * (descuentoCliente / 100);
  const totalConDescuento = totalSinDescuento - montoDescuento;

  return {
    carrito,
    descuentoCliente,
    agregarAlCarrito,
    modificarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    realizarVenta,
    actualizarDescuento,
    totalVenta: totalConDescuento,
    totalSinDescuento,
    montoDescuento,
    hayStockDisponible, 
    obtenerStockDisponible 
  };
};