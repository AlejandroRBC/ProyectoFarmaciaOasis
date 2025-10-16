import { 
  Container, 
  Title, 
  Button, 
  Group, 
  Paper,
  Grid,
  Card,
  ActionIcon,
  Text,
  Divider,
  Box
} from '@mantine/core';
import { IconPlus, IconX, IconTruck } from '@tabler/icons-react';
import { useProveedores } from './hooks/useProveedores';
import { ProveedorList } from './components/ProveedorList';
import { ProveedorForm } from './components/ProveedorForm';
import { Buscador } from '../global/components/buscador/Buscador';
import './proveedor.css';

export function ProveedorPage() {
  const {
    proveedores,
    proveedoresOriginales,
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
  } = useProveedores();

  const handleGuardarProveedor = (datosProveedor) => {
    if (proveedorEditando) {
      actualizarProveedor({ ...datosProveedor, id: proveedorEditando.id });
    } else {
      crearProveedor(datosProveedor);
    }
    cerrarFormulario();
  };

  const abrirNuevoProveedor = () => {
    setProveedorEditando(null);
    setMostrarForm(true);
  };

  const abrirEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarForm(true);
  };

  const cerrarFormulario = () => {
    setMostrarForm(false);
    setProveedorEditando(null);
  };

  const renderizarResultado = (resultado) => (
    <Group justify="space-between" w="100%">
      <div>
        <Text size="sm" fw={500}>
          {resultado.label}
        </Text>
        <Text size="xs" c="dimmed">
          {resultado.contacto} • {resultado.email}
        </Text>
      </div>
      <Text size="xs" c="blue" className="result-category">
        {resultado.category}
      </Text>
    </Group>
  );

  return (
    <div className="proveedor-page">
      <Container size="xl" py="xl">
        {/* Header */}
        <Group justify="space-between" mb="xl">
          <Group gap="md">
            <div className="header-icon">
              <IconTruck size={32} />
            </div>
            <div>
              <Title order={1} className="gradient-title">Gestión de Proveedores</Title>
              <Text c="dimmed" size="sm">Administra tu lista de proveedores</Text>
            </div>
          </Group>
          
          {!mostrarForm && (
            <Button 
              leftSection={<IconPlus size={18} />}
              onClick={abrirNuevoProveedor}
              size="md"
            >
              Nuevo Proveedor
            </Button>
          )}
        </Group>

        <Grid gutter="xl" align="start">
          {/* Lista de proveedores */}
          <Grid.Col span={mostrarForm ? 8 : 12}>
            <Paper withBorder p="md" radius="md" className="list-container">
              <div className="card-header">
                <Group justify="space-between" align="flex-end" mb="md">
                  <div>
                    <Title order={2} className="gradient-title">Lista de Proveedores</Title>
                    <Text c="dimmed" size="sm">
                      {proveedores.length} de {proveedoresOriginales.length} proveedores
                      {busqueda && ` - Buscando: "${busqueda}"`}
                    </Text>
                  </div>
                </Group>
                
                {/* BUSCADOR CENTRADO */}
                <Box className="buscador-container">
                  <Buscador
                    placeholder="Buscar proveedores..."
                    value={busqueda}
                    onChange={setBusqueda}
                    onSearch={(valor) => console.log('Buscando:', valor)}
                    onClear={() => setBusqueda('')}
                    onResultSelect={manejarSeleccionResultado}
                    results={resultadosBusqueda}
                    renderResult={renderizarResultado}
                    width="100%"
                    maxWidth="500px"
                    withShortcut={true}
                    withSearchButton={false}
                    autoFocus={false}
                  />
                </Box>
              </div>
              <Divider my="md" />
              <ProveedorList
                proveedores={proveedores}
                onEditar={abrirEditarProveedor}
                onEliminar={eliminarProveedor}
              />
            </Paper>
          </Grid.Col>

          {/* Formulario */}
          {mostrarForm && (
            <Grid.Col span={4}>
              <Card withBorder shadow="lg" p="lg" radius="md" className="form-card">
                <div className="form-header">
                  <Group justify="space-between" align="center">
                    <div>
                      <Title order={3} className="gradient-title">
                        {proveedorEditando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                      </Title>
                      <Text c="dimmed" size="sm">
                        {proveedorEditando ? 'Modifica la información' : 'Completa los datos'}
                      </Text>
                    </div>
                    <ActionIcon
                      size="lg"
                      onClick={cerrarFormulario}
                      className="close-btn"
                    >
                      <IconX size={20} />
                    </ActionIcon>
                  </Group>
                </div>
                <Divider my="md" />
                <ProveedorForm
                  proveedor={proveedorEditando}
                  onGuardar={handleGuardarProveedor}
                />
              </Card>
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </div>
  );
}