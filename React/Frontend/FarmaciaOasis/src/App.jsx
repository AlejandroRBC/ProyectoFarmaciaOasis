import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './modules/navbar/navbar';
import Dashboard from './modules/dashboard/dashboard';
import Inventario from './modules/inventario-ventas/inventario';
import HistorialVentas from './modules/historial-ventas/historial-ventas';
import IngresosEgresos from './modules/ingresos-egresos/ingresos-egresos';


function App() {
  return (
    <Router>
      <Navbar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/historial-ventas" element={<HistorialVentas />} />
          <Route path="/ingresos-egresos" element={<IngresosEgresos />} />
        </Routes>
      </Navbar>
    </Router>
  );
}

export default App;