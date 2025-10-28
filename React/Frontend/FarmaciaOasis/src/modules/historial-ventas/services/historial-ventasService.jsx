// FILE: React/Frontend/FarmaciaOasis/src/modules/historial-ventas/services/historial-ventasService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';  

const HistorialVentasService = {
  // Obtener todas las ventas con detalle de productos y cliente
  obtenerVentasDetalle: async () => {
    try {
      console.log('Solicitando datos de ventas...');
      const response = await axios.get(`${API_URL}/ventas-detalle`);
      console.log('Respuesta completa:', response);
      
      // Manejar diferentes estructuras de respuesta
      if (response.data && Array.isArray(response.data.data)) {
        console.log('Datos encontrados en response.data.data:', response.data.data.length);
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        console.log('Datos encontrados en response.data:', response.data.length);
        return response.data;
      } else if (response.data && Array.isArray(response.data.ventas)) {
        console.log('Datos encontrados en response.data.ventas:', response.data.ventas.length);
        return response.data.ventas;
      } else {
        console.warn('Estructura de datos inesperada:', response.data);
        return [];
      }
    } catch (error) {
      console.error("Error completo al obtener ventas:", error);
      
      // Proporcionar más detalles del error
      if (error.response) {
        console.error('Error del servidor:', error.response.status, error.response.data);
        throw new Error(`Error del servidor: ${error.response.status} - ${error.response.data.message || 'Sin mensaje'}`);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.');
      } else {
        console.error('Error en la configuración de la solicitud:', error.message);
        throw new Error(`Error de configuración: ${error.message}`);
      }
    }
  },

  // Función alternativa que puede usar el hook
  obtenerVentas: async () => {
    return await HistorialVentasService.obtenerVentasDetalle();
  },

  // Filtrar ventas por cliente
  obtenerVentasPorCliente: async (id_cliente) => {
    try {
      const ventas = await HistorialVentasService.obtenerVentasDetalle();
      return ventas.filter(v => v.id_cliente === id_cliente || v.cliente_id === id_cliente);
    } catch (error) {
      console.error("Error al filtrar ventas por cliente:", error);
      throw error;
    }
  },

  // Filtrar ventas por rango de fechas
  obtenerVentasPorFecha: async (fechaInicio, fechaFin) => {
    try {
      const ventas = await HistorialVentasService.obtenerVentasDetalle();
      return ventas.filter(v => {
        const fechaVenta = new Date(v.fecha);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);
        
        return fechaVenta >= inicio && fechaVenta <= fin;
      });
    } catch (error) {
      console.error("Error al filtrar ventas por fecha:", error);
      throw error;
    }
  }
};

export default HistorialVentasService;