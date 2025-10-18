// components/VentasChart.jsx - VERSIÓN CON MÉTRICAS EN HEADER
import { useState } from 'react';
import { Paper, Title, Text, Group, Badge, ThemeIcon, Button } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconTrendingUp, IconCurrencyDollar, IconChartLine, IconPackage, IconReceipt } from '@tabler/icons-react';
import '../dashboard.css';

function VentasChart({ data }) {
  const [tipoGrafica, setTipoGrafica] = useState('monto');
  
  // ✅ CORREGIDO: Manejar array vacío en todos los reduce
  const totalVentas = data.reduce((sum, item) => sum + (item.ventas || 0), 0);
  const totalProductos = data.reduce((sum, item) => sum + (item.productos || 0), 0);
  const totalNroVentas = data.reduce((sum, item) => sum + (item.nroVentas || 0), 0);
  const promedioVentas = data.length > 0 ? totalVentas / data.length : 0;
  const promedioNroVentas = data.length > 0 ? totalNroVentas / data.length : 0;
  
  // ✅ CORREGIDO: Manejar array vacío en tendencia
  const crecimiento = data.length > 1 ? 
    ((data[data.length - 1][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas'] - 
      data[data.length - 2][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas']) / 
     data[data.length - 2][tipoGrafica === 'monto' ? 'ventas' : 'nroVentas'] * 100).toFixed(1) : 0;
  
  // ✅ CORREGIDO: Manejar array vacío en mejor/peor mes
  const mejorMes = data.length > 0 
    ? (tipoGrafica === 'monto' 
        ? data.reduce((max, item) => (item.ventas || 0) > (max.ventas || 0) ? item : max, data[0])
        : data.reduce((max, item) => (item.nroVentas || 0) > (max.nroVentas || 0) ? item : max, data[0]))
    : { mes: 'N/A', ventas: 0, nroVentas: 0 };

  const peorMes = data.length > 0
    ? (tipoGrafica === 'monto'
        ? data.reduce((min, item) => (item.ventas || 0) < (min.ventas || 0) ? item : min, data[0])
        : data.reduce((min, item) => (item.nroVentas || 0) < (min.nroVentas || 0) ? item : min, data[0]))
    : { mes: 'N/A', ventas: 0, nroVentas: 0 };

  const totalActual = tipoGrafica === 'monto' ? totalVentas : totalNroVentas;
  const promedioActual = tipoGrafica === 'monto' ? promedioVentas : promedioNroVentas;

  // Datos para la gráfica según el tipo seleccionado
  const datosGrafica = tipoGrafica === 'monto' 
    ? data.map(item => ({ ...item, valor: item.ventas || 0, nombre: 'Monto Ventas' }))
    : data.map(item => ({ ...item, valor: item.nroVentas || 0, nombre: 'Número de Ventas' }));

  const colorLinea = tipoGrafica === 'monto' ? '#034C8C' : '#8B5CF6';

  return (
    <Paper p="xl" withBorder radius="lg" shadow="md" className="ventas-chart-container">
      {/* Header con título y métricas en la misma línea */}
      <Group justify="space-between" align="center" mb="xl">
        <Group gap="sm">
          <ThemeIcon size="lg" color="blue" variant="light">
            <IconChartLine size={20} />
          </ThemeIcon>
          <div>
            <Title order={2} c="dark.8" className="ventas-chart-title">
              Análisis de Ventas
            </Title>
            <Text size="sm" c="dimmed" className="ventas-chart-subtitle">
              Tendencias mensuales y comportamiento comercial
            </Text>
          </div>
        </Group>

        {/* Métricas en la derecha */}
        <Group gap="xl">
          {/* Total Acumulado */}
          <div style={{ textAlign: 'center' }}>
            <Badge color="blue" variant="light" size="sm" mb={4}>
              TOTAL
            </Badge>
            <Text fw={700} size="lg" c="blue.6">
              {tipoGrafica === 'monto' ? 'Bs ' : ''}{totalActual.toLocaleString('es-ES')}
            </Text>
          </div>

          {/* Tendencia */}
          <div style={{ textAlign: 'center' }}>
            <Badge color={crecimiento >= 0 ? "green" : "red"} variant="light" size="sm" mb={4}>
              {crecimiento >= 0 ? "📈" : "📉"} TENDENCIA
            </Badge>
            <Text fw={700} size="lg" c={crecimiento >= 0 ? "green.6" : "red.6"}>
              {crecimiento >= 0 ? "+" : ""}{crecimiento}%
            </Text>
          </div>

          {/* Período */}
          <div style={{ textAlign: 'center' }}>
            <Badge color="grape" variant="light" size="sm" mb={4}>
              PERÍODO
            </Badge>
            <Text fw={700} size="lg" c="grape.6">
              {data.length}m
            </Text>
          </div>
        </Group>
      </Group>

      {/* Selector de tipo de gráfica */}
      <Group justify="center" mb="md" gap="sm">
        <Button
          variant={tipoGrafica === 'monto' ? 'filled' : 'light'}
          color="blue"
          leftSection={<IconCurrencyDollar size={16} />}
          onClick={() => setTipoGrafica('monto')}
          size="md"
          radius="xl"
          className="chart-type-button"
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
          className="chart-type-button"
        >
          Número de Ventas
        </Button>
      </Group>

      {/* Gráfica dinámica según selección */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
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
                tipoGrafica === 'monto' ? `Bs ${Number(value).toLocaleString('es-ES')}` : `${value}`,
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
            
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke={colorLinea}
              strokeWidth={3}
              dot={{ fill: colorLinea, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colorLinea, strokeWidth: 2 }}
              name={tipoGrafica === 'monto' ? 'Monto Ventas' : 'Número de Ventas'}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer con métricas dinámicas */}
      <Group direction="column" gap="md" mt="lg" p="md" className="ventas-chart-footer">
        <Group justify="space-around" w="100%">
          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="blue" variant="light">
              <IconCurrencyDollar size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">
                {tipoGrafica === 'monto' ? 'Promedio Mensual' : 'Prom. Ventas/Mes'}
              </Text>
              <Text className="metric-value" c="blue.6">
                {tipoGrafica === 'monto' ? 'Bs ' : ''}{promedioActual.toLocaleString('es-ES', { 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: tipoGrafica === 'monto' ? 0 : 1 
                })}
              </Text>
            </div>
          </Group>
          
          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="green" variant="light">
              <IconTrendingUp size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">
                {tipoGrafica === 'monto' ? 'Mejor Mes' : 'Mes Más Ventas'}
              </Text>
              <Text className="metric-value" c="green.6">
                {mejorMes.mes}
              </Text>
              <Text className="metric-detail">
                {tipoGrafica === 'monto' 
                  ? `Bs ${mejorMes.ventas.toLocaleString('es-ES')}`
                  : `${mejorMes.nroVentas} ventas`
                }
              </Text>
            </div>
          </Group>
          
          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="orange" variant="light">
              <IconChartLine size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">Mes Más Bajo</Text>
              <Text className="metric-value" c="orange.6">
                {peorMes.mes}
              </Text>
              <Text className="metric-detail">
                {tipoGrafica === 'monto' 
                  ? `Bs ${peorMes.ventas.toLocaleString('es-ES')}`
                  : `${peorMes.nroVentas} ventas`
                }
              </Text>
            </div>
          </Group>
        </Group>

        <Group justify="space-around" w="100%">
          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="cyan" variant="light">
              <IconPackage size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">Total Productos</Text>
              <Text className="metric-value" c="cyan.6">
                {totalProductos.toLocaleString('es-ES')}
              </Text>
              <Text className="metric-detail">
                unidades
              </Text>
            </div>
          </Group>

          <Group gap="md" className="metric-group">
            <ThemeIcon className="metric-icon" color="violet" variant="light">
              <IconReceipt size={18} />
            </ThemeIcon>
            <div>
              <Text className="metric-label">Nro. de Ventas</Text>
              <Text className="metric-value" c="violet.6">
                {totalNroVentas.toLocaleString('es-ES')}
              </Text>
              <Text className="metric-detail">
                transacciones
              </Text>
            </div>
          </Group>
        </Group>
      </Group>
    </Paper>
  );
}

export default VentasChart;