import { Modal, Table, Badge, Text, Group, Paper, Title, Alert, ScrollArea, Box, ActionIcon } from '@mantine/core';
import { IconAlertTriangle, IconPackage, IconCheck, IconX } from '@tabler/icons-react';
function ProductosBajosModal({ productos, opened, onClose }) {
  // Determinar estado basado en stock
  const getEstado = (stock) => {
    if (stock < 4) return 'Crítico';
    if (stock < 11 && stock > 3) return 'Bajo';
    return 'Bueno';
  };

  const getBadgeColor = (stock) => {
    if (stock < 4) return 'red';
    if (stock < 11 && stock > 3) return 'orange';
    return 'green';
  };

  const getBadgeVariant = (stock) => {
    return stock < 4 ? 'filled' : 'light';
  };

  const productosCriticos = productos.filter(p => p.stock < 4).length;
  const productosBajos = productos.filter(p => p.stock < 11 && p.stock > 3).length;
  const productosNecesitanAtencion = productosCriticos + productosBajos;

  const rows = productos.map((producto) => {
    const estado = getEstado(producto.stock);
    const badgeColor = getBadgeColor(producto.stock);
    
    return (
      <Table.Tr 
        key={producto.id} 
        style={{ 
          borderLeft: producto.stock < 4 ? '3px solid #ff6b6b' : 
                      producto.stock < 11 ? '3px solid #ffa94d' : '3px solid #51cf66',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
      >
        <Table.Td style={{ padding: '8px 12px' }}>
          <Group gap="sm">
            <IconPackage 
              size={16} 
              color={badgeColor}
            />
            <div>
              <Text fw={600} size="sm" c="dark.8">{producto.nombre}</Text>
              <Text size="xs" c="dimmed">ID: {producto.id}</Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td style={{ padding: '8px 12px' }}>
          <Badge 
            color={badgeColor}
            variant={getBadgeVariant(producto.stock)}
            size="sm"
            radius="sm"
          >
            {producto.stock} unidades
          </Badge>
        </Table.Td>
        <Table.Td style={{ padding: '8px 12px' }}>
          <Group gap="xs">
            <Badge 
              color={badgeColor}
              variant={getBadgeVariant(producto.stock)}
              size="sm"
              radius="sm"
              style={{ minWidth: '70px' }}
            >
              {estado}
            </Badge>
            {producto.stock < 4 && (
              <IconAlertTriangle size={14} color="#ff6b6b" />
            )}
            {producto.stock > 10 && (
              <IconCheck size={14} color="#51cf66" />
            )}
          </Group>
        </Table.Td>
        <Table.Td style={{ padding: '8px 12px' }}>
          <Text fw={500} size="sm" c="dark.7">{producto.laboratorio}</Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
<Modal 
  opened={opened} 
  onClose={onClose}
  title={
    <Group style={{ width: '100%', position: 'relative' }}>
      <Group gap="lg">
        <div style={{
          background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
          padding: '10px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(78,205,196,0.3)'
        }}>
          <IconAlertTriangle size={22} color="white" />
        </div>
        <div>
          <Title order={3} c="dark.8" style={{ 
            fontFamily: 'system-ui',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            margin: 0
          }}>
            Control de Inventario
          </Title>
          <Text size="sm" c="dimmed" style={{ fontWeight: 500, margin: 0 }}>
            Productos por debajo del stock mínimo
          </Text>
        </div>
      </Group>
    </Group>
  }
  size="xl"
  overlayProps={{ blur: 3 }}
  radius="lg"
  centered
  withCloseButton={false}
  scrollAreaComponent={ScrollArea.Autosize}
  styles={{
    content: {
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid #e9ecef'
    },
    header: {
      background: 'white',
      borderBottom: '1px solid #f1f3f5',
      marginBottom: 0,
      padding: '20px',
      position: 'relative'
    }
  }}
>
  {/* X TRANSPARENTE FIJA EN LA ESQUINA SUPERIOR DERECHA */}
  <ActionIcon 
    variant="subtle" 
    color="gray" 
    onClick={onClose}
    size="xl"
    radius="md"
    style={{ 
      position: 'fixed',
      top: '30px',
      right: '30px',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      border: '1px solid rgba(0,0,0,0.1)',
      background: 'transparent',
      backdropFilter: 'blur(10px)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
    }}
  >
    <IconX size={20} />
  </ActionIcon>

  {productos.length === 0 ? (
    <Alert color="green" title="Todo en orden" icon={<IconPackage size={16} />} radius="md">
      No hay productos con stock bajo en este momento.
    </Alert>
  ) : (
    <>
      {/* ALERTA CON COLORES VERDE AZULADO */}
      <Box style={{ display: 'inline-block' }}>
        <Alert 
          color="orange" 
          mb="md" 
          icon={<IconAlertTriangle size={16} color="#4ecdc4" />} 
          radius="md"
          style={{
            borderLeft: '6px solid #4ecdc4',
            borderTop: '1px solid #e9ecef',
            borderRight: '1px solid #e9ecef',
            borderBottom: '1px solid #e9ecef',
            background: 'white',
            boxShadow: '0 2px 8px rgba(78,205,196,0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(78,205,196,0.3)';
            e.currentTarget.style.borderLeft = '6px solid #2ca89c';
            e.currentTarget.style.background = '#f0fffe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(78,205,196,0.2)';
            e.currentTarget.style.borderLeft = '6px solid #4ecdc4';
            e.currentTarget.style.background = 'white';
          }}
        >
          <Text fw={500}>{productosNecesitanAtencion} productos necesitan atención</Text>
        </Alert>
      </Box>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <Table 
          verticalSpacing={2}
          highlightOnHover
          styles={{
            thead: {
              backgroundColor: '#1e90ff',
            },
            th: {
              color: 'white',
              fontWeight: 600,
              fontSize: '12px',
              padding: '10px 12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderBottom: 'none'
            },
            tbody: {
              '& tr:hover': {
                backgroundColor: '#f8f9fa !important',
              }
            }
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>PRODUCTO</Table.Th>
              <Table.Th>STOCK</Table.Th>
              <Table.Th>ESTADO</Table.Th>
              <Table.Th>LABORATORIO</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>

      <Group justify="space-between" mt="md">
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            Monitoreando: {productos.length} productos
          </Text>
          {productosCriticos > 0 && (
            <Badge color="red" variant="light" size="sm">
              {productosCriticos} críticos
            </Badge>
          )}
          {productosBajos > 0 && (
            <Badge color="orange" variant="light" size="sm">
              {productosBajos} bajos
            </Badge>
          )}
        </Group>
      </Group>
    </>
  )}
</Modal>
  );
}

export default ProductosBajosModal;