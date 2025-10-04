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
import './dashboard.css';  // ✅ CSS separado

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
    <Container size="xl" py="md" className="dashboard-main-container">
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
        <Group className="dashboard-buttons-container" mt="xl" justify="center">
          <Button 
            size="md"
            variant="filled" 
            leftSection="⚠️"
            onClick={() => setMostrarBajos(true)}
            className="dashboard-button custom-gradient-btn"
          >
            PRODUCTOS POR ACABARSE
          </Button>
          
          <Button 
            size="md"
            variant="filled"
            leftSection="📅"
            onClick={() => setMostrarVencer(true)}
            className="dashboard-button custom-gradient-btn"
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