import { useVentas } from './hooks/useVentas';
import VentasList from './components/VentasList';
import './historial-ventas.css';

function HistorialVentas() {
  const { ventas, loading, error } = useVentas();

  if (loading) {
    return <div className="cargando">Cargando historial de ventas...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="historial-ventas-container">
      <h1>Historial de Ventas</h1>
      
      <div className="filtros-container">
        <div className="busqueda-ventas">
          <input 
            type="text" 
            placeholder="Buscar por cliente, CI/NIT o ID..."
            className="busqueda"
          />
          <button className="btn-buscar">🔍 Buscar</button>
        </div>
        
        <div className="filtros-fecha">
          <input type="date" className="filtro-fecha" />
          <span>a</span>
          <input type="date" className="filtro-fecha" />
          <button className="btn-filtrar">Filtrar</button>
        </div>
      </div>

      <VentasList ventas={ventas} />
      
      <div className="resumen-ventas">
        <div className="resumen-item">
          <span className="resumen-label">Total Ventas:</span>
          <span className="resumen-valor">
            {ventas.length}
          </span>
        </div>
        <div className="resumen-item">
          <span className="resumen-label">Ingreso Total:</span>
          <span className="resumen-valor">
            {ventas.reduce((total, venta) => total + venta.total, 0).toFixed(2)} Bs
          </span>
        </div>
      </div>
    </div>
  );
}

export default HistorialVentas;