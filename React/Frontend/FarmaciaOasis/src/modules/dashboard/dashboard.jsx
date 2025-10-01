import { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import ProductosBajosModal from './components/ProductosBajosModal';
import ProductosVencerModal from './components/ProductosVencerModal';
import './dashboard.css';

function Dashboard() {
const {
    metricas,
    productosBajos,
    productosPorVencer,
    loading
} = useDashboard();

const [mostrarBajos, setMostrarBajos] = useState(false);
const [mostrarVencer, setMostrarVencer] = useState(false);

if (loading) {
    return <div className="cargando">Cargando dashboard...</div>;
}

return (
    <div className="dashboard-container">
    {/* Header con logo y fecha */}
    <Header />

    {/* Tarjetas de métricas */}
    <div className="metricas-container">
        <MetricCard
        valor={metricas.totalHoy}
        etiqueta="Total de Hoy"
        sufijo="Bs"
        color="#034C8C"
        />
        <MetricCard
        valor={metricas.productosVendidos}
        etiqueta="Nro. Productos Vendidos"
        color="#04BFBF"
        />
        <MetricCard
        valor={metricas.ventasHoy}
        etiqueta="Ventas Hoy"
        color="#ABB4B2"
        />
    </div>

    {/* Botones de acción */}
    <div className="acciones-dashboard">
        <button 
        className="btn-alerta"
        onClick={() => setMostrarBajos(true)}
        >
        ⚠️ PRODUCTOS POR ACABARSE
        </button>
        <button 
        className="btn-alerta"
        onClick={() => setMostrarVencer(true)}
        >
        📅 PRODUCTOS POR VENCER
        </button>
    </div>

    {/* Modales */}
    {mostrarBajos && (
        <ProductosBajosModal
        productos={productosBajos}
        onClose={() => setMostrarBajos(false)}
        />
    )}

    {mostrarVencer && (
        <ProductosVencerModal
        productos={productosPorVencer}
        onClose={() => setMostrarVencer(false)}
        />
    )}
    </div>
);
}

export default Dashboard;