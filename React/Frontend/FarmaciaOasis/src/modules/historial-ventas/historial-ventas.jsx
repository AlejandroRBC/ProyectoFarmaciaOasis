
import VentasList from './components/VentasList';


import { Select } from '../global/components/select/Select';
import { Buscador } from '../global/components/buscador/Buscador';
import { IconPill, IconUser, IconBuilding } from '@tabler/icons-react';
import { useState, useEffect } from 'react';


import './historial-ventas.css';

function HistorialVentas() {
  // para los selects
  const [categoria, setCategoria] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  // para los buscadores
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
// Ejemplo: Búsqueda de productos
useEffect(() => {
  if (searchValue.trim()) {
    setLoading(true);
    
    // Simular búsqueda en API
    const timer = setTimeout(() => {
      const mockResults = [
        { id: 1, name: 'Paracetamol 500mg', category: 'Analgésicos', stock: 45 },
        { id: 2, name: 'Ibuprofeno 400mg', category: 'Antiinflamatorios', stock: 23 },
        { id: 3, name: 'Amoxicilina 250mg', category: 'Antibióticos', stock: 12 },
      ].filter(item => 
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.category.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  } else {
    setSearchResults([]);
  }
}, [searchValue]);

const handleSearch = (value) => {
  console.log('Buscando:', value);
  // Lógica de búsqueda aquí
};

const handleResultSelect = (result) => {
  console.log('Producto seleccionado:', result);
  setSearchValue(result.name);
};

const renderProductResult = (product) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <div>
      <div style={{ fontWeight: 600, fontSize: '14px' }}>{product.name}</div>
      <div style={{ fontSize: '12px', color: '#666' }}>{product.category}</div>
    </div>
    <div style={{ 
      fontSize: '12px', 
      color: product.stock > 10 ? 'green' : 'orange',
      fontWeight: 600
    }}>
      {product.stock} unidades
    </div>
  </div>
);


  return (
    <div >
      <div style={{ padding: '20px' }}>
      {/* Búsqueda básica */}
      <Buscador
        placeholder="Buscar productos, categorías..."
        value={searchValue}
        onChange={setSearchValue}
        onSearch={handleSearch}
        width="100%"
        maxWidth="500px"
      />

      {/* Búsqueda con resultados personalizados */}
      <Buscador
        placeholder="Buscar medicamentos..."
        value={searchValue}
        onChange={setSearchValue}
        onSearch={handleSearch}
        results={searchResults}
        onResultSelect={handleResultSelect}
        renderResult={renderProductResult}
        loading={loading}
        withSearchButton={true}
        width="100%"
        maxWidth="500px"
        style={{ marginTop: '20px' }}
      />

      {/* Búsqueda compacta para navbar */}
      <Buscador
        placeholder="Buscar..."
        value={searchValue}
        onChange={setSearchValue}
        width="300px"
        maxWidth="300px"
        withShortcut={true}
        size="sm"
        style={{ marginTop: '20px' }}
      />
    </div>













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