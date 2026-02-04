import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const inventarioService = {
    /**
     * Obtiene todos los productos del inventario
     */
    obtenerProductos: async () => {
        try {
        const response = await axios.get(`${API_URL}/productos`);
        return response.data.data;
        } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
        }
    },
    
    /**
     * Obtiene un producto específico por su ID
     */
    obtenerProducto: async (id) => {
        try {
        const response = await axios.get(`${API_URL}/productos/${id}`);
        return response.data.data;
        } catch (error) {
        console.error('Error al obtener producto:', error);
        throw error;
        }
    },
    
    /**
     * Crea un nuevo producto en el inventario
     */
    crearProducto: async (productoData) => {
        try {
        const response = await axios.post(`${API_URL}/productos`, productoData);
        return response.data.data;
        } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
        }
    },
    
    /**
     * Actualiza los datos de un producto existente
     */
    actualizarProducto: async (id, productoData) => {
        try {
        const response = await axios.put(`${API_URL}/productos/${id}`, productoData);
        return response.data.data;
        } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw error;
        }
    },
    
    /**
     * Elimina un producto mediante eliminación suave
     */
    eliminarProducto: async (id) => {
        try {
        const response = await axios.delete(`${API_URL}/productos/${id}`);
        return response.data.data;
        } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw error;
        }
    },
    
    /**
     * Crea un nuevo laboratorio
     */
    crearLaboratorio: async (laboratorioData) => {
        try {
        const datosParaBackend = {
            nombre_labo: laboratorioData.nombre,
            direccion: laboratorioData.direccion
        };
        
        const response = await axios.post(`${API_URL}/laboratorios`, datosParaBackend);
        return response.data.data;
        } catch (error) {
        console.error('Error al crear laboratorio:', error);
        throw error;
        }
    },
    
    /**
     * Obtiene todos los laboratorios disponibles
     */
    obtenerLaboratorios: async () => {
        try {
        const response = await axios.get(`${API_URL}/laboratorios`);
        return response.data.data.map(lab => ({
            id: lab.id_lab,
            nombre: lab.nombre_labo,
            direccion: lab.direccion
        }));
        } catch (error) {
        console.error('Error al obtener laboratorios:', error);
        throw error;
        }
    }
};

export default inventarioService;