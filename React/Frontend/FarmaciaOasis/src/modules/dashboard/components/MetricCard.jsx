// components/MetricCard.jsx
import { Paper, Text, Group, ThemeIcon, Badge } from '@mantine/core';
import { 
  IconCurrencyDollar, 
  IconPackage, 
  IconShoppingCart,
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';

function MetricCard({ 
  valor, 
  etiqueta, 
  sufijo = '', 
  color, 
  porcentaje, 
  tendencia 
}) {
  const formattedValue = typeof valor === 'number' && sufijo === 'Bs' 
    ? `Bs ${valor.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`
    : valor.toLocaleString();

  // Iconos según el tipo de métrica
  const getIcon = () => {
    if (sufijo === 'Bs') return <IconCurrencyDollar size={28} />;
    if (etiqueta.includes('Productos')) return <IconPackage size={28} />;
    if (etiqueta.includes('Ventas')) return <IconShoppingCart size={28} />;
    return <IconTrendingUp size={28} />;
  };

  // Color de tendencia REAL
  const tendenciaColor = tendencia === 'up' ? 'green' : 'red';
  const tendenciaIcon = tendencia === 'up' ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />;

  return (
    <Paper 
      p="xl" 
      withBorder 
      radius="lg"
      shadow="md"
      style={{ 
        borderLeft: `4px solid ${color}`,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Text size="sm" c="dimmed" fw={600} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {etiqueta}
          </Text>
          
          <Text size="32px" fw={800} c={color} style={{ 
            lineHeight: 1.2,
            margin: '8px 0'
          }}>
            {formattedValue}
          </Text>

          {/* Badge de tendencia REAL */}
          <Badge 
            color={tendenciaColor} 
            variant="light" 
            leftSection={tendenciaIcon}
            size="sm"
            style={{ borderRadius: '12px' }}
          >
            {porcentaje} vs ayer
          </Badge>
        </div>

        {/* Icono principal */}
        <ThemeIcon 
          size="xl" 
          variant="light" 
          color={color}
          style={{ 
            borderRadius: '12px'
          }}
        >
          {getIcon()}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

export default MetricCard;