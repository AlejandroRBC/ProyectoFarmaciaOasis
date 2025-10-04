// components/VentasChart.jsx
import { useState } from 'react';
import { Paper, Title, Text, Group, Badge, ThemeIcon, Select, Button } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconTrendingUp, IconCurrencyDollar, IconChartLine, IconPackage, IconReceipt } from '@tabler/icons-react';

function VentasChart({ data }) {
  const [año, setAño] = useState(2024);
  const [tipoGrafica, setTipoGrafica] = useState('monto'); // 'monto' o 'numero'
  
  // Calcular métricas funcionales con datos mock
  const totalVentas = data.reduce((sum, item) => sum + item.ventas, 0);
  const totalProductos = data.reduce((sum, item) => sum + item.productos, 0);
  const totalNroVentas = data.reduce((sum, item) => sum + item.nroVentas, 0);
  const promedioVentas = totalVentas / data.length;
  const promedioNroVentas = totalNroVentas / data.length;
  
  // TENDENCIA CORREGIDA - Dinámica según tipo de gráfica
  const crecimiento = data.length > 1 ? 
    ((data[data.length - 1][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas'] - 
      data[data.length - 2][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas']) / 
     data[data.length - 2][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas'] * 100).toFixed(1) : 0;
  
  // MEJOR Y PEOR MES CORREGIDOS - Dinámicos según tipo de gráfica
  const mejorMes = tipoGrafica === 'monto' 
    ? data.reduce((max, item) => item.ventas > max.ventas ? item : max)
    : data.reduce((max, item) => item.nroVentas > max.nroVentas ? item : max);

  const peorMes = tipoGrafica === 'monto'
    ? data.reduce((min, item) => item.ventas < min.ventas ? item : min)
    : data.reduce((min, item) => item.nroVentas < min.nroVentas ? item : min);

  // Años disponibles para el filtro
  const años = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];

  // Datos para la gráfica según el tipo seleccionado
  const datosGrafica = tipoGrafica === 'monto' 
    ? data.map(item => ({ ...item, valor: item.ventas, nombre: 'Monto Ventas' }))
    : data.map(item => ({ ...item, valor: item.nroVentas, nombre: 'Número de Ventas' }));

  const colorLinea = tipoGrafica === 'monto' ? '#034C8C' : '#8B5CF6';
  const totalActual = tipoGrafica === 'monto' ? totalVentas : totalNroVentas;
  const promedioActual = tipoGrafica === 'monto' ? promedioVentas : promedioNroVentas;

  return (
    <Paper p="xl" withBorder radius="lg" shadow="md" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e9ecef'
    }}>
      {/* Header con filtro y métricas */}
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Group gap="sm" mb="xs">
            <ThemeIcon size="lg" color="blue" variant="light">
              <IconChartLine size={20} />
            </ThemeIcon>
            <Title order={2} c="dark.8" style={{ 
              fontFamily: 'system-ui',
              fontWeight: 800,
              letterSpacing: '-0.5px'
            }}>
              Análisis de Ventas {año}
            </Title>
          </Group>
          <Text size="sm" c="dimmed" style={{ fontWeight: 500 }}>
            Tendencias mensuales y comportamiento comercial
          </Text>
        </div>
        
        <Group gap="lg">
          {/* Filtro de Año */}
          <Select
            label="Año"
            placeholder="Selecciona año"
            value={año.toString()}
            onChange={(value) => setAño(parseInt(value))}
            data={años}
            style={{ width: 120 }}
            size="sm"
          />
          
          <div style={{ textAlign: 'center' }}>
            <Badge color="blue" variant="light" size="sm" mb="xs">
              TOTAL {año}
            </Badge>
            <Text fw={800} size="xl" c="blue.6">
              {tipoGrafica === 'monto' ? 'Bs ' : ''}{totalActual.toLocaleString('es-ES')}
            </Text>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Badge color={crecimiento >= 0 ? "green" : "red"} variant="light" size="sm" mb="xs">
              {crecimiento >= 0 ? "📈" : "📉"} TENDENCIA
            </Badge>
            <Text fw={800} size="xl" c={crecimiento >= 0 ? "green.6" : "red.6"}>
              {crecimiento >= 0 ? "+" : ""}{crecimiento}%
            </Text>
          </div>
        </Group>
      </Group>

      {/* Selector de tipo de gráfica - BOTONES INTERACTIVOS */}
      <Group justify="center" mb="md" gap="sm">
        <Button
          variant={tipoGrafica === 'monto' ? 'filled' : 'light'}
          color="blue"
          leftSection={<IconCurrencyDollar size={16} />}
          onClick={() => setTipoGrafica('monto')}
          size="md"
          radius="xl"
        >
          Monto Ventas (Bs)
        </Button>
        
        <Button
          variant={tipoGrafica === 'numero' ? 'filled' : 'light'}
          color="violet"
          leftSection={<IconReceipt size={16} />}
          onClick={() => setTipoGrafica('numero')}
          size="md"
          radius="xl"
        >
          Número de Ventas
        </Button>
      </Group>

      {/* Gráfica dinámica según selección */}
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={datosGrafica}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="mes" 
              tick={{ fill: '#666', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            
            <YAxis 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
              tickFormatter={(value) => 
                tipoGrafica === 'monto' ? `Bs ${value}` : `${value}`
              }
            />
            
            <Tooltip 
              formatter={(value) => [
                tipoGrafica === 'monto' ? `Bs ${value.toLocaleString('es-ES')}` : `${value}`,
                tipoGrafica === 'monto' ? 'Monto Ventas' : 'Número de Ventas'
              ]}
              labelFormatter={(label) => `Mes: ${label}`}
              contentStyle={{ 
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                background: 'white',
                fontSize: '14px',
                fontWeight: 600
              }}
              labelStyle={{
                fontWeight: 700,
                color: colorLinea,
                fontSize: '13px'
              }}
            />
            
            {/* Línea dinámica según selección */}
            <Line 
              type="linear" 
              dataKey="valor" 
              stroke={colorLinea}
              strokeWidth={3}
              dot={false}
              activeDot={false}
              name={tipoGrafica === 'monto' ? 'Monto Ventas' : 'Número de Ventas'}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer con métricas dinámicas */}
      <Group justify="space-around" mt="lg" p="md" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
      }}>
        <Group gap="md">
          <ThemeIcon size="lg" color="blue" variant="light">
            <IconCurrencyDollar size={18} />
          </ThemeIcon>
          <div>
            <Text fw={700} size="sm" c="dark.7">
              {tipoGrafica === 'monto' ? 'Promedio Mensual' : 'Prom. Ventas/Mes'}
            </Text>
            <Text fw={600} size="lg" c="blue.6">
              {tipoGrafica === 'monto' ? 'Bs ' : ''}{promedioActual.toLocaleString('es-ES', { maximumFractionDigits: tipoGrafica === 'monto' ? 0 : 1 })}
            </Text>
          </div>
        </Group>
        
        <Group gap="md">
          <ThemeIcon size="lg" color="green" variant="light">
            <IconTrendingUp size={18} />
          </ThemeIcon>
          <div>
            <Text fw={700} size="sm" c="dark.7">
              {tipoGrafica === 'monto' ? 'Mejor Mes' : 'Mes Más Ventas'}
            </Text>
            <Text fw={600} size="lg" c="green.6">
              {mejorMes.mes}
            </Text>
            <Text fw={500} size="sm" c="dimmed">
              {tipoGrafica === 'monto' 
                ? `Bs ${mejorMes.ventas.toLocaleString('es-ES')}`
                : `${mejorMes.nroVentas} ventas`
              }
            </Text>
          </div>
        </Group>
        
        <Group gap="md">
          <ThemeIcon size="lg" color="orange" variant="light">
            <IconChartLine size={18} />
          </ThemeIcon>
          <div>
            <Text fw={700} size="sm" c="dark.7">Mes Más Bajo</Text>
            <Text fw={600} size="lg" c="orange.6">
              {peorMes.mes}
            </Text>
            <Text fw={500} size="sm" c="dimmed">
              {tipoGrafica === 'monto' 
                ? `Bs ${peorMes.ventas.toLocaleString('es-ES')}`
                : `${peorMes.nroVentas} ventas`
              }
            </Text>
          </div>
        </Group>

        <Group gap="md">
          <ThemeIcon size="lg" color="cyan" variant="light">
            <IconPackage size={18} />
          </ThemeIcon>
          <div>
            <Text fw={700} size="sm" c="dark.7">Total Productos</Text>
            <Text fw={600} size="lg" c="cyan.6">
              {totalProductos.toLocaleString('es-ES')}
            </Text>
            <Text fw={500} size="sm" c="dimmed">
              unidades
            </Text>
          </div>
        </Group>

        <Group gap="md">
          <ThemeIcon size="lg" color="violet" variant="light">
            <IconReceipt size={18} />
          </ThemeIcon>
          <div>
            <Text fw={700} size="sm" c="dark.7">Nro. de Ventas</Text>
            <Text fw={600} size="lg" c="violet.6">
              {totalNroVentas.toLocaleString('es-ES')}
            </Text>
            <Text fw={500} size="sm" c="dimmed">
              transacciones
            </Text>
          </div>
        </Group>
      </Group>
    </Paper>
  );
}

export default VentasChart;