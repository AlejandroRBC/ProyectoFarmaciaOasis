import axios from 'axios';
const API_URL = 'http://localhost:400/api';
const InventarioService = {
    //GET todos los laboratorios
    obtenerLaboratorios: async() => {
        try{
            const response = await axios.get(`${API_URL}/laboratorios`);
            return response.data.data;            
        }catch(error){
            console.error('Error al obtener laboratorios: ',error);
            throw error;
        }
    },

    //GET laboratorio por id_lab
    obtenerLaboratorio: async (id_lab) => {
        try{
            const response = await axios.get(`${API_URL}/laboratorios/${id_lab}`);
            return response.data.data;
        }catch (error){
            console.error('Error al obtener laboratorio:',error);
            throw error;
        }
    },

    // POST crear laboratorio
    crearLaboratorio: async (laboratorioData) => {
        try{
            const response = await axios.post(`${API_URL}/laboratorios`, laboratorioData);
            return response.data.data;
        }catch (error){
            console.error('Error al crear laboratorios: ',error);
            throw error;
        }
    },
    // PUT actualizar laboratorio
    actualizarLaboratorio: async (id_lab, laboratorioData) => {
        try{
            const response = await axios.put(`${API_URL}/laboratorios/${id_lab}`, laboratorioData);
            return response.data.data;
        }catch (error){
            console.error('Error al actualizar laboratorios: ',error);
            throw error;
        }
    },

    //DELETE laboratorios 
    eliminarLaboratorios: async (id_lab) => {
        try{
            const response = await axios.delete(`${API_URL}/laboratorios/${id_lab}`);
            return response.data.data;
        }catch(error){
            console.error('Error al eliminar laboratorio: ',error);
            throw error;
        }
    }
};

export default InventarioService;
