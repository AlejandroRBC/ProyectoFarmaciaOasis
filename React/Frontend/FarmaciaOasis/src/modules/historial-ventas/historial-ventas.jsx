
import VentasList from './components/VentasList';
import { Select } from '../global/components/select/Select';
import { IconPill, IconUser, IconBuilding } from '@tabler/icons-react';
import { useState } from 'react';


import './historial-ventas.css';

function HistorialVentas() {
  const [categoria, setCategoria] = useState('');
  const [laboratorio, setLaboratorio] = useState('');

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      {/* Select básico */}
      <Select
        label="Categoría del Producto"
        placeholder="Elige una categoría..."
        data={[
          { value: 'medicamentos', label: '💊 Medicamentos' },
          { value: 'vitaminas', label: '🧪 Vitaminas y Suplementos' },
          { value: 'cuidado', label: '🧴 Cuidado Personal' },
          { value: 'maternidad', label: '👶 Maternidad e Infantil' },
        ]}
        value={categoria}
        onChange={setCategoria}
        required
      />

      {/* Select con ícono y búsqueda */}
      <Select
        label="Laboratorio"
        placeholder="Busca laboratorio..."
        data={[
          { value: 'lab1', label: 'Laboratorio ABC' },
          { value: 'lab2', label: 'Lab Farma Internacional' },
          { value: 'lab3', label: 'PharmaCorp Solutions' },
          { value: 'lab4', label: 'BioTech Laboratories' },
        ]}
        value={laboratorio}
        onChange={setLaboratorio}
        icon={<IconBuilding size={18} />}
        searchable
        clearable
      />

      {/* Select con descripción */}
      <Select
        label="Tipo de Cliente"
        placeholder="Selecciona tipo de cliente"
        description="Esta selección afectará los precios y descuentos"
        data={[
          { value: 'regular', label: '👤 Cliente Regular' },
          { value: 'frecuente', label: '⭐ Cliente Frecuente' },
          { value: 'corporativo', label: '🏢 Cliente Corporativo' },
        ]}
        icon={<IconUser size={18} />}
      />

      {/* Select con error */}
      <Select
        label="Producto"
        placeholder="Selecciona un producto"
        data={[
          { value: 'paracetamol', label: 'Paracetamol 500mg' },
          { value: 'ibuprofeno', label: 'Ibuprofeno 400mg' },
        ]}
        error="Este producto está agotado"
        icon={<IconPill size={18} />}
      />
    </div>
  );
}

export default HistorialVentas;