import { useState, useMemo } from 'react';

const clientesIniciales = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123456789' },
  { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '987654321' },
  { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '555555555' },
];

export function useClientes() {
  const [clientes, setClientes] = useState(clientesIniciales);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Filtrar clientes en tiempo real
  const clientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) return clientes;
    
    const termino = busqueda.toLowerCase();
    return clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(termino) ||
      cliente.email.toLowerCase().includes(termino) ||
      cliente.telefono.includes(termino)
    );
  }, [clientes, busqueda]);

  // Generar resultados para el buscador (con sugerencias)
  const resultadosBusqueda = useMemo(() => {
    if (!busqueda.trim()) return [];
    
    return clientesFiltrados.map(cliente => ({
      id: cliente.id,
      label: cliente.nombre,
      category: 'Cliente',
      email: cliente.email,
      telefono: cliente.telefono,
      data: cliente // Datos completos para usar en renderResult
    }));
  }, [clientesFiltrados, busqueda]);

  const crearCliente = (nuevoCliente) => {
    const cliente = {
      ...nuevoCliente,
      id: Math.max(0, ...clientes.map(c => c.id)) + 1,
    };
    setClientes([...clientes, cliente]);
    setMostrarForm(false);
  };

  const actualizarCliente = (clienteActualizado) => {
    setClientes(clientes.map(c => 
      c.id === clienteActualizado.id ? clienteActualizado : c
    ));
    setMostrarForm(false);
  };

  const eliminarCliente = (id) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  // Manejar selección de resultado del buscador
  const manejarSeleccionResultado = (resultado) => {
    // Aquí puedes decidir qué hacer cuando se selecciona un resultado
    // Por ejemplo, abrir el modal de edición automáticamente
    const clienteEncontrado = clientes.find(c => c.id === resultado.id);
    if (clienteEncontrado) {
      abrirEditarCliente(clienteEncontrado);
    }
  };

  const abrirEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarForm(true);
  };

  return {
    clientes: clientesFiltrados,
    clientesOriginales: clientes,
    clienteEditando,
    mostrarForm,
    busqueda,
    setBusqueda,
    resultadosBusqueda,
    setClienteEditando,
    setMostrarForm,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    manejarSeleccionResultado,
  };
}