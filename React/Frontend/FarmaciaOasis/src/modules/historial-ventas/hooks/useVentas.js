import { useState, useEffect, useMemo } from 'react'; 
import HistorialVentasService from '../services/historial-ventasService'; 

export function useVentas() {
  const [ventas, setearVentas] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('general');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);

  // Cargar ventas al inicializar
  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError(null);

      const datos = await HistorialVentasService.obtenerVentasDetalle();
      console.log('Datos recibidos del servicio:', datos);

      if (!Array.isArray(datos)) {
        setError('Formato de datos incorrecto del servidor');
        setearVentas([]);
        return;
      }

      // Procesar y normalizar datos
      const ventasProcesadas = datos.map(venta => ({
        id: venta.id || venta.id_venta,
        id_venta: venta.id_venta || venta.id,
        fecha: venta.fecha,
        hora: venta.hora,
        cliente: venta.cliente || venta.nombre_cliente || 'Cliente no especificado',
        ci_nit: venta.ci_nit || venta.ci || venta.nit || 'N/A',
        metodo_pago: venta.metodo_pago || venta.tipo_pago || 'No especificado',
        total: parseFloat(venta.total) || 0,
        productos: venta.productos || venta.detalle_productos || 'Productos no especificados'
      }));

      // Ordenar por fecha y hora (más reciente primero)
      const ventasOrdenadas = ventasProcesadas.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`);
        const fechaB = new Date(`${b.fecha}T${b.hora}`);
        return fechaB - fechaA;
      });

      setearVentas(ventasOrdenadas);
    } catch (err) {
      console.error('Error completo:', err);
      setError(`Error al cargar el historial de ventas: ${err.message}`);
      setearVentas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar ventas por búsqueda
  const ventasFiltradas = useMemo(() => {
    let resultado = [...ventas];

    // Aplicar filtro de búsqueda
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase().trim();
      resultado = resultado.filter(venta =>
        venta.id_venta.toString().includes(termino) ||
        venta.cliente.toLowerCase().includes(termino) ||
        venta.productos.toLowerCase().includes(termino) ||
        venta.ci_nit.toLowerCase().includes(termino)
      );
    }

    // Aplicar filtro de tipo (período)
    if (filtroTipo !== 'general') {
      const ahora = new Date();
      
      switch (filtroTipo) {
        case 'hoy':
          { const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          const manana = new Date(hoy);
          manana.setDate(manana.getDate() + 1);
          
          resultado = resultado.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            return fechaVenta >= hoy && fechaVenta < manana;
          });
          break; }
        
        case 'semana':
          { const inicioSemana = new Date();
          inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
          inicioSemana.setHours(0, 0, 0, 0);
          
          resultado = resultado.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            return fechaVenta >= inicioSemana;
          });
          break; }
        
        case 'mes':
          { const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
          
          resultado = resultado.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            return fechaVenta >= inicioMes;
          });
          break; }
        
        case 'año':
          { const inicioAño = new Date(ahora.getFullYear(), 0, 1);
          
          resultado = resultado.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            return fechaVenta >= inicioAño;
          });
          break; }
        
        default:
          break;
      }
    }

    // Aplicar filtro de rango de fechas
    if (dateRange.start && dateRange.end) {
      const inicio = new Date(dateRange.start);
      inicio.setHours(0, 0, 0, 0);
      
      const fin = new Date(dateRange.end);
      fin.setHours(23, 59, 59, 999);
      
      resultado = resultado.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta >= inicio && fechaVenta <= fin;
      });
    }

    return resultado;
  }, [ventas, busqueda, filtroTipo, dateRange]);

  return {
    ventas: ventasFiltradas,
    ventasOriginales: ventas,
    error,
    loading,
    busqueda,
    filtroTipo,
    dateRange,
    setBusqueda,
    setFiltroTipo,
    setDateRange,
    recargarVentas: cargarVentas
  };
}