import { useState } from 'react';

export const useModales = () => {
  const [modalProducto, setModalProducto] = useState({
    abierto: false,
    producto: null
  });
  
  const [modalLaboratorio, setModalLaboratorio] = useState(false);

  /**
   * Abre el modal de producto para crear o editar
   */
  const abrirModalProducto = (producto = null) => {
    setModalProducto({ 
      abierto: true,
      producto
    });
  };

  /**
   * Cierra el modal de producto y limpia los datos
   */
  const cerrarModalProducto = () => {
    setModalProducto({ 
      abierto: false,
      producto: null
    });
  };

  /**
   * Abre el modal de laboratorio
   */
  const abrirModalLaboratorio = () => setModalLaboratorio(true);

  /**
   * Cierra el modal de laboratorio
   */
  const cerrarModalLaboratorio = () => setModalLaboratorio(false);

  return {
    modalProducto,
    modalLaboratorio,
    
    abrirModalProducto,
    cerrarModalProducto,
    abrirModalLaboratorio,
    cerrarModalLaboratorio
  };
};