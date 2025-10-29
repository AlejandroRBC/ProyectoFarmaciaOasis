import { Modal, Table, Badge, Text, Group, Paper, Title, Alert, ScrollArea, Box, ActionIcon } from '@mantine/core';
import { IconCalendarExclamation, IconCalendar, IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';
import '../dashboard.css';

/**
 * Modal para mostrar productos próximos a vencer
 * Clasifica por niveles de urgencia y muestra días restantes
 */
function ProductosVencerModal({ productos, opened, onClose }) {
  // Sistema de colores según días restantes para vencimiento
  const getBadgeColor = (dias) => {
    if (dias <= 7) return 'red';
    if (dias <= 30) return 'orange';
    return 'green';
  };

  const getBadgeVariant = (dias) => {
    return dias <= 7 ? 'filled' : 'light';
  };

  // Estadísticas de productos por nivel de urgencia
  const productosCriticos = productos.filter(p => p.diasRestantes <= 7).length;
  const productosAdvertencia = productos.filter(p => p.diasRestantes > 7 && p.diasRestantes <= 30).length;
  const productosNecesitanAtencion = productosCriticos + productosAdvertencia;

  // Colores de borde según urgencia
  const getBorderColor = (dias) => {
    if (dias <= 7) return '#ff6b6b';
    if (dias <= 30) return '#ffa94d';
    return '#51cf66';
  };

  // Filas de la tabla con productos próximos a vencer
  const rows = productos.map((producto) => {
    const badgeColor = getBadgeColor(producto.diasRestantes);
    const borderColor = getBorderColor(producto.diasRestantes);
    
    return (
      <Table.Tr 
        key={producto.id}
        className="vencer-product-row"
        style={{ borderLeft: `3px solid ${borderColor}` }}
      >
        <Table.Td className="vencer-product-cell">
          <Group gap="sm">
            <IconCalendar size={16} color={badgeColor} />
            <div>
              <Text fw={600} size="sm" c="dark.8">{producto.nombre}</Text>
              <Text size="xs" c="dimmed">ID: {producto.id}</Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td className="vencer-product-cell">
          <Text fw={500} size="sm" c="dark.7">{producto.laboratorio}</Text>
        </Table.Td>
        <Table.Td className="vencer-product-cell">
          {/* Formateo de fecha con ajuste para zona horaria de Bolivia */}
          <Text fw={500} size="sm">
            {new Date(
              new Date(producto.fechaVencimiento).getFullYear(),
              new Date(producto.fechaVencimiento).getMonth(),
              new Date(producto.fechaVencimiento).getDate() + 1,
              23, 59, 0
            ).toLocaleDateString('es-BO', { timeZone: 'America/La_Paz' })}
          </Text>
        </Table.Td>
        <Table.Td className="vencer-product-cell">
          <Group gap="xs">
            <Badge 
              color={badgeColor}
              variant={getBadgeVariant(producto.diasRestantes)}
              size="sm"
              radius="sm"
              className="vencer-status-badge"
            >
              {producto.diasRestantes} días
            </Badge>
            {producto.diasRestantes <= 7 && (
              <IconAlertTriangle size={14} color="#ff6b6b" />
            )}
            {producto.diasRestantes > 30 && (
              <IconCheck size={14} color="#51cf66" />
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title={
        <Group className="vencer-modal-header-container">
          <Group gap="lg">
            <div className="vencer-modal-icon-container">
              <IconCalendarExclamation size={22} color="white" />
            </div>
            <div>
              <Title order={3} c="dark.8" className="vencer-modal-title">
                Control de Vencimientos
              </Title>
              <Text size="sm" c="dimmed" className="vencer-modal-subtitle">
                Productos próximos a vencer
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
    >
      {/* Botón de cierre personalizado */}
      <ActionIcon 
        variant="subtle" 
        color="gray" 
        onClick={onClose}
        size="xl"
        radius="md"
        className="vencer-modal-close-btn"
      >
        <IconX size={20} />
      </ActionIcon>

      {/* Estado vacío o con productos por vencer */}
      {productos.length === 0 ? (
        <Alert color="green" title="Todo en orden" icon={<IconCalendar size={16} />} radius="md">
          No hay productos por vencer en los próximos 30 días.
        </Alert>
      ) : (
        <>
          {/* Alerta de productos que necesitan atención */}
          <Box className="vencer-alert-container">
            <Alert 
              color="blue" 
              mb="md" 
              icon={<IconCalendarExclamation size={16} color="#1871c1" />} 
              radius="md"
              className="vencer-alert"
            >
              <Text fw={500}>{productosNecesitanAtencion} productos necesitan atención</Text>
            </Alert>
          </Box>

          {/* Tabla de productos por vencer */}
          <Paper withBorder radius="md" className="vencer-table-paper">
            <Table verticalSpacing={2} highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>PRODUCTO</Table.Th>
                  <Table.Th>LABORATORIO</Table.Th>
                  <Table.Th>FECHA VENCIMIENTO</Table.Th>
                  <Table.Th>DÍAS RESTANTES</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Paper>

          {/* Resumen de estadísticas */}
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
              {productosAdvertencia > 0 && (
                <Badge color="orange" variant="light" size="sm">
                  {productosAdvertencia} advertencia
                </Badge>
              )}
            </Group>
          </Group>
        </>
      )}
    </Modal>
  );
}

export default ProductosVencerModal;