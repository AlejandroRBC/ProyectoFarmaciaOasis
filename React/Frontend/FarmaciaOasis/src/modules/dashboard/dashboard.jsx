import { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import { 
  Container, 
  Grid, 
  Group, 
  Button, 
  LoadingOverlay
} from '@mantine/core';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import ProductosBajosModal from './components/ProductosBajosModal';
import ProductosVencerModal from './components/ProductosVencerModal';
import VentasChart from './components/VentasChart';
import TopProductos from './components/TopProductos';

function Dashboard() {
  const {
    metricas,
    productosBajos,
    productosPorVencer,
    ventasMensuales,
    topProductos,
    loading,
    calcularPorcentaje,
    determinarTendencia
  } = useDashboard();

  const [mostrarBajos, setMostrarBajos] = useState(false);
  const [mostrarVencer, setMostrarVencer] = useState(false);

  if (loading) {
    return (
      <Container size="xl" py="md">
        <LoadingOverlay visible />
      </Container>
    );
  }

  return (
    <Container size="xl" py="md" style={{ marginTop: '20px' }}>
      {/* 1. HEADER */}
      <Header 
        productosBajos={productosBajos}
        productosPorVencer={productosPorVencer}
      />

      {/* 2. MÉTRICAS */}
      <Grid mt="xl">
        <Grid.Col span={4}>
          <MetricCard
            valor={metricas.totalHoy}
            etiqueta="Total de Hoy"
            sufijo="Bs"
            color="#034C8C"
            porcentaje={calcularPorcentaje(metricas.totalHoy, metricas.totalAyer)}
            tendencia={determinarTendencia(metricas.totalHoy, metricas.totalAyer)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MetricCard
            valor={metricas.productosVendidos}
            etiqueta="Productos Vendidos"
            color="#04BFBF"
            porcentaje={calcularPorcentaje(metricas.productosVendidos, metricas.productosAyer)}
            tendencia={determinarTendencia(metricas.productosVendidos, metricas.productosAyer)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MetricCard
            valor={metricas.ventasHoy}
            etiqueta="Ventas Hoy"
            color="#ABB4B2"
            porcentaje={calcularPorcentaje(metricas.ventasHoy, metricas.ventasAyer)}
            tendencia={determinarTendencia(metricas.ventasHoy, metricas.ventasAyer)}
          />
        </Grid.Col>
      </Grid>

      {/* 3. DASHBOARD (Gráfica de ventas) */}
      <Grid mt="xl">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <VentasChart data={ventasMensuales} />
        </Grid.Col>

        {/* 4. TOP PRODUCTOS */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <TopProductos productos={topProductos} />
        </Grid.Col>
      </Grid>

      {/* 5. BOTONES (ÚLTIMO) */}
      <Group justify="center" mt="xl" gap="lg">
        <Button 
          size="md"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          leftSection="⚠️"
          onClick={() => setMostrarBajos(true)}
          radius="xl"
          style={{
            padding: '12px 24px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 119, 182, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          PRODUCTOS POR ACABARSE
        </Button>
        
        <Button 
          size="md"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
          leftSection="📅"
          onClick={() => setMostrarVencer(true)}
          radius="xl"
          style={{
            padding: '12px 24px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 119, 182, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          PRODUCTOS POR VENCER
        </Button>
      </Group>

      {/* MODALES */}
      <ProductosBajosModal
        productos={productosBajos}
        opened={!!mostrarBajos}
        onClose={() => setMostrarBajos(false)}
      />

      <ProductosVencerModal
        productos={productosPorVencer}
        opened={!!mostrarVencer}
        onClose={() => setMostrarVencer(false)}
      />
    </Container>
  );
}

export default Dashboard;