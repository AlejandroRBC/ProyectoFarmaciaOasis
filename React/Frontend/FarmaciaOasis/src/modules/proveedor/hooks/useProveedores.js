import { useState, useMemo } from 'react';

const proveedoresIniciales = [
  { id: 1, empresa: 'Distribuidora ABC', contacto: 'Roberto Martínez', email: 'roberto@abc.com', telefono: '111222333' },
  { id: 2, empresa: 'Suministros XYZ', contacto: 'Laura González', email: 'laura@xyz.com', telefono: '444555666' },
  { id: 3, empresa: 'Importaciones Global', contacto: 'Carlos Rodríguez', email: 'carlos@global.com', telefono: '777888999' },
];

export function useProveedores() {
  const [proveedores, setProveedores] = useState(proveedoresIniciales);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Filtrar proveedores en tiempo real
  const proveedoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return proveedores;
    
    const termino = busqueda.toLowerCase();
    return proveedores.filter(proveedor => 
      proveedor.empresa.toLowerCase().includes(termino) ||
      proveedor.contacto.toLowerCase().includes(termino) ||
      proveedor.email.toLowerCase().includes(termino) ||
      proveedor.telefono.includes(termino)
    );
  }, [proveedores, busqueda]);

  // Generar resultados para el buscador
  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return [];
    
    return proveedoresFiltrados.map(proveedor => ({
      id: proveedor.id,
      label: proveedor.empresa,
      category: 'Proveedor',
      contacto: proveedor.contacto,
      email: proveedor.email,
      telefono: proveedor.telefono,
      data: proveedor
    }));
  }, [proveedoresFiltrados, busqueda]);

  const crearProveedor = (nuevoProveedor) => {
    const proveedor = {
      ...nuevoProveedor,
      id: Math.max(0, ...proveedores.map(p => p.id)) + 1,
    };
    setProveedores([...proveedores, proveedor]);
    setMostrarForm(false);
  };

  const actualizarProveedor = (proveedorActualizado) => {
    setProveedores(proveedores.map(p => 
      p.id === proveedorActualizado.id ? proveedorActualizado : p
    ));
    setMostrarForm(false);
  };

  const eliminarProveedor = (id) => {
    setProveedores(proveedores.filter(p => p.id !== id));
  };

  // Manejar selección de resultado del buscador
  const manejarSeleccionResultado = (resultado) => {
    const proveedorEncontrado = proveedores.find(p => p.id === resultado.id);
    if (proveedorEncontrado) {
      abrirEditarProveedor(proveedorEncontrado);
    }
  };

  const abrirEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarForm(true);
  };

  return {
    proveedores: proveedoresFiltrados,
    proveedoresOriginales: proveedores,
    proveedorEditando,
    mostrarForm,
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    setProveedorEditando,
    setMostrarForm,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    manejarSeleccionResultado,
  };
}