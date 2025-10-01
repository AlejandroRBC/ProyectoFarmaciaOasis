import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './modules/layout/Layout';
import Dashboard from './modules/dashboard/Dashboard';
import Inventario from './modules/inventario-ventas/Inventario';
import HistorialVentas from './modules/historial-ventas/Historial-ventas';

// Páginas placeholder (puedes crearlas después)
const HistorialProducto = () => <div>Historial Producto - En construcción</div>;
const Reportes = () => <div>Generar Reportes - En construcción</div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/historial-ventas" element={<HistorialVentas />} />
          <Route path="/historial-producto" element={<HistorialProducto />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;