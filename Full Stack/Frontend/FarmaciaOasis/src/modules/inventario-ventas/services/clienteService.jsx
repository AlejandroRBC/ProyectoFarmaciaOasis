import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const clienteService = {
  /**
   * Obtiene todos los clientes del sistema
   */
  obtenerClientes: async () => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  /**
   * Busca cliente por CI/NIT incluyendo inactivos
   */
  obtenerClientePorCI: async (ci_nit) => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      const clientes = response.data.data;
      return clientes.find(cliente => cliente.ci_nit === ci_nit);
    } catch (error) {
      console.error('Error al buscar cliente por CI:', error);
      throw error;
    }
  },

  /**
   * Busca cliente activo por CI exacto para autocompletado
   */
  buscarClientePorCIExacto: async (ci_nit) => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      const clientes = response.data.data;
      return clientes.find(cliente => cliente.ci_nit === ci_nit && cliente.estado === 'activo');
    } catch (error) {
      console.error('Error al buscar cliente por CI exacto:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo cliente en el sistema
   */
  crearCliente: async (clienteData) => {
    try {
      const response = await axios.post(`${API_URL}/clientes`, clienteData);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  /**
   * Reactiva un cliente inactivo cambiando su estado
   */
  reactivarCliente: async (idCliente) => {
    try {
      const response = await axios.get(`${API_URL}/clientes/${idCliente}`);
      const cliente = response.data.data;
      
      const responseUpdate = await axios.put(`${API_URL}/clientes/${idCliente}`, {
        nombre: cliente.nombre,
        ci_nit: cliente.ci_nit,
        descuento: cliente.descuento,
        estado: 'activo'
      });
      
      return responseUpdate.data.data;
    } catch (error) {
      console.error('Error al reactivar cliente:', error);
      throw error;
    }
  },

  /**
   * Busca cliente existente o crea uno nuevo para ventas
   */
  buscarOCrearCliente: async (nombre, ci_nit) => {
    try {
      if (ci_nit === '00000' || ci_nit === '' || !ci_nit) {
        return null;
      }

      const clienteExistente = await clienteService.obtenerClientePorCI(ci_nit);
      
      if (clienteExistente) {
        if (clienteExistente.estado === 'inactivo') {
          await clienteService.reactivarCliente(clienteExistente.cod_cli);
        }
        
        return clienteExistente.cod_cli;
      }

      const nuevoCliente = await clienteService.crearCliente({
        nombre: nombre || 'Cliente S/N',
        ci_nit: ci_nit,
        descuento: 0,
        estado: 'activo'
      });

      return nuevoCliente.cod_cli;
    } catch (error) {
      console.error('Error en buscarOCrearCliente:', error);
      throw error;
    }
  }
};

export default clienteService;