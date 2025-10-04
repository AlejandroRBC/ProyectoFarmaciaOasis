// components/TopProductos.jsx
import { Paper, Title, Table, Badge, Text, Group, ThemeIcon, Progress, Stack, ScrollArea, Box } from '@mantine/core';
import { IconCrown, IconStar, IconTrendingUp, IconAward } from '@tabler/icons-react';

function TopProductos({ productos }) {
  // MOSTRAR TODOS los productos, no hacer slice
  const todosProductos = productos;
  const totalProductos = productos.length;
  
  // Calcular venta máxima para la barra de progreso
  const maxVentas = Math.max(...todosProductos.map(p => p.ventas));
  
  // Colores para cada posición
  const getPositionColor = (index) => {
    const colors = {
      0: { badge: 'yellow', icon: 'gold', bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
      1: { badge: 'gray', icon: 'silver', bg: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)' },
      2: { badge: 'orange', icon: 'bronze', bg: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)' },
      default: { badge: 'blue', icon: 'blue', bg: 'linear-gradient(135deg, #228BE6 0%, #1C7ED6 100%)' }
    };
    return colors[index] || colors.default;
  };

  // Iconos para cada posición
  const getPositionIcon = (index) => {
    const icons = {
      0: <IconCrown size={16} />,
      1: <IconAward size={16} />,
      2: <IconStar size={16} />,
      default: <IconTrendingUp size={16} />
    };
    return icons[index] || icons.default;
  };

  const rows = todosProductos.map((producto, index) => {
    const positionColors = getPositionColor(index);
    const porcentaje = (producto.ventas / maxVentas) * 100;
    
    return (
      <Table.Tr 
        key={producto.nombre} 
        style={{ 
          borderBottom: '1px solid #f8f9fa',
          transition: 'all 0.2s ease',
          height: '65px' // Altura fija más compacta
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa';
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <Table.Td>
          <Badge 
            size="md"
            variant="gradient"
            gradient={{ 
              from: positionColors.badge, 
              to: positionColors.badge, 
              deg: 135 
            }}
            leftSection={getPositionIcon(index)}
            style={{
              minWidth: '45px',
              justifyContent: 'center',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            #{index + 1}
          </Badge>
        </Table.Td>
        
        <Table.Td>
          <Stack gap={2}>
            <Text fw={700} size="sm" c="dark.8" lineClamp={1}>
              {producto.nombre}
            </Text>
            <Badge 
              size="xs" 
              variant="light" 
              color="gray"
              style={{ width: 'fit-content' }}
            >
              {producto.categoria}
            </Badge>
          </Stack>
        </Table.Td>
        
        <Table.Td>
          <Stack gap="xs" w="100%">
            <Group justify="space-between" gap="xs">
              <Group gap={4}>
                <ThemeIcon size="sm" color="blue" variant="light">
                  <IconTrendingUp size={12} />
                </ThemeIcon>
                <Text fw={800} size="sm" c="blue.6">
                  {producto.ventas.toLocaleString('es-ES')}
                </Text>
              </Group>
              <Text size="xs" c="dimmed" fw={600}>
                {porcentaje.toFixed(0)}%
              </Text>
            </Group>
            
            <Progress 
              value={porcentaje} 
              color={
                index === 0 ? 'yellow' : 
                index === 1 ? 'gray' : 
                index === 2 ? 'orange' : 'blue'
              }
              size="sm"
              radius="xl"
              style={{
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}
            />
          </Stack>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper 
      p="lg" 
      withBorder 
      radius="lg" 
      shadow="md"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e9ecef',
        height: '500px', // Altura más compacta
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header compacto */}
      <Box style={{ flexShrink: 0 }}>
        <Group justify="space-between" align="flex-start" mb="md">
          <Group gap="sm">
            <ThemeIcon 
              size="md" 
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange', deg: 135 }}
            >
              <IconCrown size={18} />
            </ThemeIcon>
            <div>
              <Title order={3} c="dark.8" style={{ 
                fontFamily: 'system-ui',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                Top Productos
              </Title>
              <Text size="xs" c="dimmed" style={{ fontWeight: 500 }}>
                {totalProductos} productos en ranking
              </Text>
            </div>
          </Group>
          
          <Badge 
            size="md" 
            variant="gradient" 
            gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          >
            Top {totalProductos}
          </Badge>
        </Group>
      </Box>

      {/* Tabla con scroll - MOSTRANDO TODOS LOS PRODUCTOS */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <ScrollArea 
          style={{ 
            flex: 1,
            minHeight: 0
          }}
          scrollbarSize={6}
          type="auto"
        >
          <Table>
            <Table.Thead>
              <Table.Tr style={{ borderBottom: '2px solid #e9ecef' }}>
                <Table.Th style={{ 
                  fontWeight: 700, 
                  color: '#495057',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 12px'
                }}>
                  Pos
                </Table.Th>
                <Table.Th style={{ 
                  fontWeight: 700, 
                  color: '#495057',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 12px'
                }}>
                  Producto
                </Table.Th>
                <Table.Th style={{ 
                  fontWeight: 700, 
                  color: '#495057',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '8px 12px'
                }}>
                  Ventas
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>

      {/* Footer compacto */}
      <Box style={{ flexShrink: 0 }}>
        <Group justify="space-between" mt="md" p="sm" style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <Group gap="xs">
            <ThemeIcon size="xs" color="green" variant="light">
              <IconTrendingUp size={12} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="xs" c="dark.7">Total Vendido</Text>
              <Text fw={800} size="sm" c="green.6">
                {todosProductos.reduce((sum, p) => sum + p.ventas, 0).toLocaleString('es-ES')}
              </Text>
            </div>
          </Group>
          
          {totalProductos > 10 && (
            <Text size="xs" c="dimmed" fw={600}>
              📜 {totalProductos} productos
            </Text>
          )}
        </Group>
      </Box>
    </Paper>
  );
}

export default TopProductos;