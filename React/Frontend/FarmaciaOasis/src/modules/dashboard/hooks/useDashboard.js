import { useState, useEffect } from 'react';

// Datos mock para el dashboard
const productosMock = [
  {
    id: 1,
    nombre: 'Paracetamol',
    stock: 1,
    laboratorio: 'Laboratorio ABC',
    estado: 'Crítico'
  },
  {
    id: 2,
    nombre: 'Ibuprofeno',
    stock: 3,
    laboratorio: 'Lab Farma',
    estado: 'Bajo'
  },
  {
    id: 3,
    nombre: 'Amoxicilina',
    stock: 8,
    laboratorio: 'Lab Salud',
    estado: 'Bajo'
  }
];

const productosVencerMock = [
  {
    id: 1,
    nombre: 'Azitromicina',
    laboratorio: 'Laboratorio ABC',
    fechaVencimiento: '2025-04-21',
    diasRestantes: 5
  },
  {
    id: 2,
    nombre: 'Loratadina',
    laboratorio: 'Lab Farma',
    fechaVencimiento: '2025-05-15',
    diasRestantes: 30
  }
];

export const useDashboard = () => {
  const [metricas, setMetricas] = useState({
    totalHoy: 0,
    productosVendidos: 0,
    ventasHoy: 0
  });
  const [productosBajos, setProductosBajos] = useState([]);
  const [productosPorVencer, setProductosPorVencer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const cargarDatos = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos mock
      setMetricas({
        totalHoy: 2394.50,
        productosVendidos: 45,
        ventasHoy: 12
      });
      
      setProductosBajos(productosMock);
      setProductosPorVencer(productosVencerMock);
      
      setLoading(false);
    };

    cargarDatos();
  }, []);

  return {
    metricas,
    productosBajos,
    productosPorVencer,
    loading
  };
};