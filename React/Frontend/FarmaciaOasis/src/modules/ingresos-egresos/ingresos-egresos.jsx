import { useState } from 'react';
import {Paper, Text, Grid, Group, LoadingOverlay, Alert, Title, Box, Badge, ActionIcon, Tooltip, Button, Stack} from '@mantine/core';
import {IconTrendingUp, IconTrendingDown, IconArrowsExchange, IconFilter, IconRefresh, IconX, IconChartBar, IconDownload, IconSearch, IconCalendar} from '@tabler/icons-react';
import { useMovimientos } from './hooks/useMovimientos';
import MovimientosList from './components/MovimientosList';
import { Select } from '../global/components/Select/Select';
import { Buscador } from '../global/components/buscador/Buscador';
import Modal from '../global/components/modal/Modal';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import './ingresos-egresos.css';

function IngresosEgresos() {
  const { movimientos, loading, error, refetch, buscarMovimientos } = useMovimientos();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [filtroRapido, setFiltroRapido] = useState('general');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);


  // Opciones para el select de filtro
  const opcionesFiltro = [
    { value: 'todos', label: 'Todos los movimientos' },
    { value: 'ingreso', label: 'Solo ingresos' },
    { value: 'egreso', label: 'Solo egresos' },
  ];

  // Opciones para filtros rápidos de fecha
  const opcionesFiltroRapido = [
    { value: 'general', label: 'General' },
    { value: 'semana', label: 'Esta semana' },
    { value: 'mes', label: 'Este mes' },
    { value: 'año', label: 'Este año' },
  ];

  // Función para aplicar filtros rápidos de fecha
  const aplicarFiltroRapido = (filtro) => {
    const hoy = new Date();
    setFiltroRapido(filtro);
    
    switch (filtro) {
      case 'semana':
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        setDateRange({ start: inicioSemana, end: hoy });
        break;
      case 'mes':
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        setDateRange({ start: inicioMes, end: hoy });
        break;
      case 'año':
        const inicioAño = new Date(hoy.getFullYear(), 0, 1);
        setDateRange({ start: inicioAño, end: hoy });
        break;
      case 'general':
        setDateRange({ start: null, end: null });
        break;
      default:
        break;
    }
  };

  const renderizarResultado = (resultado) => {
    const precio = typeof resultado.precio_venta === 'number' 
      ? resultado.precio_venta.toFixed(2) 
      : '-';

    return (
      <Group justify="space-between" w="100%">
        <div>
          <Text size="sm" fw={500}>
            {resultado.nombre}
          </Text>
          <Text size="xs" c="dimmed">
            {resultado.laboratorio} • Bs.{precio}
          </Text>
        </div>
        <Text size="xs" c="blue" className="result-category">
          {resultado.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
        </Text>
      </Group>
    );
  };

  // Función para filtrar por fecha
  const filtrarPorFecha = (movimiento) => {
    if (!dateRange.start && !dateRange.end) return true;
    const fechaMov = movimiento.fecha;
    const fechaInicio = dateRange.start
      ? new Date(dateRange.start.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null;

    const fechaFin = dateRange.end
      ? new Date(dateRange.end.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null;

    return (!fechaInicio || fechaMov >= fechaInicio) &&
          (!fechaFin || fechaMov <= fechaFin);
  };



  // Filtrar movimientos
  const movimientosFiltrados = buscarMovimientos(busqueda)
    .filter(mov => {
      const coincideTipo = 
        filtroTipo === 'todos' ||
        (filtroTipo === 'ingreso' && mov.stock_nuevo > mov.stock_antiguo) ||
        (filtroTipo === 'egreso' && mov.stock_nuevo < mov.stock_antiguo);
      
      return coincideTipo;
    })
    .filter(filtrarPorFecha);
  const resultadosBusquedaA = movimientosFiltrados.map(m => ({
    nombre: m.nombre,
    laboratorio: m.laboratorio,
    precio_venta: m.precio_venta,
    tipo: m.tipo,
  }));
  // Estadísticas
  const totalIngresos = movimientosFiltrados.filter(m => m.stock_nuevo > m.stock_antiguo).length;
  const totalEgresos = movimientosFiltrados.filter(m => m.stock_nuevo < m.stock_antiguo).length;
  const totalMovimientos = movimientosFiltrados.length;

  // Función para generar reporte Excel
  const generarReporteExcel = async (movimientos) => {
    if (!movimientos || movimientos.length === 0) {
      alert("No hay datos para generar el reporte.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Movimientos");

    // Título
    worksheet.mergeCells("A1:I1");
    const titulo = worksheet.getCell("A1");
    titulo.value = "Reporte de Ingresos - Egresos";
    titulo.font = { bold: true, size: 16 };
    titulo.alignment = { horizontal: "center" };

    //  Encabezados
    worksheet.addRow([]);
    const encabezados = [
      "N°",
      "Nombre",
      "Presentación",
      "Laboratorio",
      "Lote",
      "Precio Venta (Bs)",
      "Stock Antiguo",
      "Stock Nuevo",
      "Tipo",
      "Fecha"
    ];
    const headerRow = worksheet.addRow(encabezados);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "70E2FA" } 
      };
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Filas de datos
    movimientos.forEach((m, i) => {
      const row = worksheet.addRow([
        i + 1,
        m.nombre,
        m.presentacion,
        m.laboratorio,
        m.lote,
        m.precio_venta?.toFixed(2) || "0.00",
        m.stock_antiguo,
        m.stock_nuevo,
        m.tipo === "ingreso" ? "Ingreso" : "Egreso",
        m.fecha
      ]);

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      });

      // Colorear columna tipo según ingreso/egreso
      const tipoCell = row.getCell(8);
      tipoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: m.tipo === "ingreso" ? "C6F6D5" : "FEB2B2" }
      };
    });

    // Ajustar anchos de columna
    const widths = [5, 20, 20, 20, 10, 15, 15, 15, 15, 15];
    widths.forEach((w, i) => worksheet.getColumn(i + 1).width = w);

    // Guardar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fechaActual = new Date().toISOString().split("T")[0];
    saveAs(new Blob([buffer]), `reporte-ingresos-egresos-${fechaActual}.xlsx`);
  };

  // Función para aplicar intervalo desde el modal
  const handleAplicarIntervalo = (fechaInicio, fechaFin) => {
    setDateRange({ start: fechaInicio, end: fechaFin });
    setIsModalOpen(false);
  };

  // Función para limpiar intervalo
  const handleLimpiarIntervalo = () => {
    setDateRange({ start: null, end: null });
  };

  if (loading) {
    return (
      <Box style={{ position: 'relative', height: 400 }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert color="red" title="Error" variant="filled">
        {error}
      </Alert>
    );
  }

  return (
    <Box className="ingresos-egresos-container">
      {/* Header con título y controles */}
      <Group justify="space-between" mb="xl">
        <Group>
          <div className="title-icon">
            <IconChartBar/>
          </div>
          <Title order={1} className="gradient-title" >
            Ingresos y Egresos de Productos
          </Title>
        </Group>
      </Group>

      {/* Controles de Filtrado */}
      <Paper p="lg" withBorder radius="lg" shadow="sm" mb="xl" style={{ backgroundColor: '#f8f9fa', width:'100%'}}>
        <Stack gap="md">
            {/* Fila de Buscador y Botón Excel */}
            <Group justify="space-between" align="center" style={{ width: '100%' }}>
              <Box style={{ flex: 1, marginRight: '16px' }}>
                <Buscador
                  placeholder="Buscar por Lote o Nombre de Producto"
                  value={busqueda}
                  onChange={setBusqueda}
                  results={resultadosBusquedaA}
                  renderResult={renderizarResultado}
                  width="100%" 
                  withSearchButton={false}
                  size="md"
                />
              </Box>
              {(dateRange.start || dateRange.end) && (
                <Button
                  variant="outline"                 
                  onClick={handleLimpiarIntervalo}
                  style={{ height: '100%' }}
                >
                  Limpiar
                </Button>
              )}
            </Group>

            {/* Fila de filtros y botones */}
            <Group className="controls-container" spacing="md" align="flex-end" position="left">
              <Box className="filtro-tipo-centrado">
                <Select
                  label="Filtrar por tipo"
                  data={opcionesFiltro}
                  value={filtroTipo}
                  onChange={setFiltroTipo}
                  icon={<IconFilter size={16} />}
                />
              </Box>

              <Box>
                <Select
                  label="Período de tiempo"
                  data={opcionesFiltroRapido}
                  value={filtroRapido}
                  onChange={aplicarFiltroRapido}
                  icon={<IconCalendar size={16} />}
                />
              </Box>

              <Button
                variant={dateRange.start ? "filled" : "outline"}
                leftSection={<IconCalendar size={16} />}
                onClick={() => setIsModalOpen(true)}
                style={{ height: '100%' }}
              >
                Intervalo {dateRange.start && '✓'}
              </Button>
              <Button
                leftSection={<IconDownload size={18} />}
                onClick={() => generarReporteExcel(movimientosFiltrados)}
                disabled={movimientosFiltrados.length === 0}
                style={{ height: '100%' }}
              >
                Generar Reporte Excel
              </Button>
          
            </Group>

          </Stack>
      </Paper>

      {/* Modal para intervalo de fechas */}
      <Modal
        titulo="Seleccionar Intervalo de Fechas"
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <DateRangeModal 
          onApply={handleAplicarIntervalo}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      {/* Resumen de Movimientos */}
      <div className="stats-container">
        <Paper className="stat-card" shadow="sm" p="md">
          <div className="stat-icon-total"><IconArrowsExchange size={24} /></div>
          <Text size="sm" c="dimmed">Total Movimientos</Text>
          <Text className="number-total">{totalMovimientos}</Text>
        </Paper>

        <Paper className="stat-card" shadow="sm" p="md">
          <div className="stat-icon-ingreso"><IconTrendingUp size={24} /></div>
          <Text size="sm" c="dimmed">Ingresos</Text>
          <Text className="number-ingreso">{totalIngresos}</Text>
        </Paper>

        <Paper className="stat-card" shadow="sm" p="md">
          <div className="stat-icon-egreso"><IconTrendingDown size={24} /></div>
          <Text size="sm" c="dimmed">Egresos</Text>
          <Text className="number-egreso">{totalEgresos}</Text>
        </Paper>

        <Paper className="stat-card" shadow="sm" p="md">
          <div className="stat-icon-saldo"><IconArrowsExchange size={24} /></div>
          <Text size="sm" c="dimmed">Saldo Neto</Text>
          <Text className="number-saldo">{totalIngresos - totalEgresos}</Text>
        </Paper>
      </div>


      {/* Lista de Movimientos */}
      <MovimientosList movimientos={movimientosFiltrados} />
    </Box>
  );
}

// Componente Modal para selección de rango de fechas
function DateRangeModal({ onApply, onCancel }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      onApply(start, end);
    }
  };

  const isDateValid = startDate && endDate && new Date(startDate) <= new Date(endDate);

  return (
    <Stack gap="md" align="center">
      <div className="date-inputs">
        <div className="date-field">
          <label>Fecha Inicio</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-picker" />
        </div>
        <div className="date-field">
          <label>Fecha Fin</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-picker" />
        </div>
      </div>

      <Group spacing="sm" position="center">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleApply} disabled={!isDateValid}>Aplicar</Button>
      </Group>
    </Stack>

  );
}

export default IngresosEgresos;