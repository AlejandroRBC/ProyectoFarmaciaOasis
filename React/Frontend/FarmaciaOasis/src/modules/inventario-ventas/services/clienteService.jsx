// Ruta: frontend/farmaciaOasis/src/modules/inventario-ventas/services/clienteService.jsx

import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const clienteService = {
  // Obtener todos los clientes
  obtenerClientes: async () => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  // Buscar cliente por CI/NIT
  obtenerClientePorCI: async (ci_nit) => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      const clientes = response.data.data;
      return clientes.find(cliente => 
        cliente.ci_nit === ci_nit && cliente.estado === 'activo'
      );
    } catch (error) {
      console.error('Error al buscar cliente por CI:', error);
      throw error;
    }
  },

  // Crear nuevo cliente
  crearCliente: async (clienteData) => {
    try {
      const response = await axios.post(`${API_URL}/clientes`, clienteData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  // Buscar o crear cliente (función auxiliar para ventas)
  buscarOCrearCliente: async (nombre, ci_nit) => {
    try {
      // Si es venta rápida (sin datos reales)
      if (ci_nit === '00000' || ci_nit === '' || !ci_nit) {
        return null; // Permitir venta sin cliente
      }

      // Buscar si el cliente ya existe
      const clienteExistente = await clienteService.obtenerClientePorCI(ci_nit);
      
      if (clienteExistente) {
        console.log('✅ Cliente encontrado:', clienteExistente);
        return clienteExistente.cod_cli;
      }

      // Si no existe, crear nuevo cliente
      console.log('ℹ️ Cliente no encontrado, creando nuevo...');
      const nuevoCliente = await clienteService.crearCliente({
        nombre: nombre || 'Cliente S/N',
        ci_nit: ci_nit,
        descuento: 0,
        estado: 'activo'
      });

      console.log('✅ Nuevo cliente creado:', nuevoCliente);
      return nuevoCliente.cod_cli;
    } catch (error) {
      console.error('❌ Error en buscarOCrearCliente:', error);
      throw error;
    }
  }
};

export default clienteService;