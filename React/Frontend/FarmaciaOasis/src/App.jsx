import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Layout from './modules/navbar/Navbar';
import Dashboard from './modules/dashboard/Dashboard';
import Inventario from './modules/inventario-ventas/Inventario';
import HistorialVentas from './modules/historial-ventas/Historial-ventas';
import IngresosEgresos from './modules/ingresos-egresos/Ingresos-Egresos';

function App() {
  return (
    <Router>
      <AppShell header={{ height: 'max-height' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/historial-ventas" element={<HistorialVentas />} />
            <Route path="/ingresos-egresos" element={<IngresosEgresos />} />
          </Routes>
        </Layout>
      </AppShell>
    </Router>
  );
}

export default App;