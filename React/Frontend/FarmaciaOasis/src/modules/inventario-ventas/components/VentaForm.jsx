

import { useState } from 'react';
import { 
  ScrollArea, Box, Group, Text, Button, ActionIcon,Flex, ThemeIcon,Badge,Stack,Modal,TextInput, Select,Alert
} from '@mantine/core';
import { 
  IconPlus, IconMinus, IconTrash, IconUser,IconShoppingCartExclamation,IconReceiptDollar,IconInvoice,IconDownload,IconPrinter,IconCheck
} from '@tabler/icons-react';
import { generarPDFVenta,
  imprimirComprobante } from '../utils/generarPDF';

function VentaForm({ 
  carrito, 
  totalVenta, 
  onModificarCantidad, 
  onEliminarItem, 
  onVaciarCarrito, 
  onRealizarVenta, 
  onCancel
}) {
  
  const [detallesVentaReal, setDetallesVentaReal] = useState(null);
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [datosVentaConfirmada, setDatosVentaConfirmada] = useState(null);
  const [numeroVentaGenerado, setNumeroVentaGenerado] = useState('');
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    ci_nit: '',
    metodo_pago: 'efectivo'
  });
  // Función mejorada para validar datos del cliente antes del envío
const validarDatosCliente = (datos) => {
  const errores = [];

  // Validar nombre
  if (!datos.nombre || datos.nombre.trim().length < 2) {
    errores.push('El nombre debe tener al menos 2 caracteres');
  }

  if (datos.nombre && datos.nombre.length > 100) {
    errores.push('El nombre no puede exceder 100 caracteres');
  }

  // Validar CI/NIT si se proporciona
  if (datos.ci_nit && datos.ci_nit.trim() !== '') {
    if (datos.ci_nit.length < 3) {
      errores.push('El CI/NIT debe tener al menos 3 caracteres');
    }
    
    if (datos.ci_nit.length > 15) {
      errores.push('El CI/NIT no puede exceder 15 caracteres');
    }

    if (!/^[0-9a-zA-Z]+$/.test(datos.ci_nit)) {
      errores.push('El CI/NIT solo puede contener números y letras');
    }
  }

  // Validar método de pago
  if (!datos.metodo_pago) {
    errores.push('El método de pago es requerido');
  }

  return errores;
};


// En handleSubmit:
const handleSubmit = async (e) => {
  
  e.preventDefault();

  // Validar datos antes de proceder
  const erroresValidacion = validarDatosCliente(datosCliente);
  if (erroresValidacion.length > 0) {
    alert(`Errores de validación:\n${erroresValidacion.join('\n')}`);
    return;
  }
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  
  try {
    // ✅ LLAMAR A LA FUNCIÓN REALIZAR VENTA Y CAPTURAR LOS DATOS COMPLETOS
    const ventaRealizada = await onRealizarVenta(datosCliente);
    
    // ✅ MOSTRAR NOTIFICACIÓN SI EL CLIENTE FUE REACTIVADO
    if (ventaRealizada.clienteReactivado) {
      alert('ℹ️ El cliente estaba inactivo y ha sido reactivado automáticamente.');
    }
    
    // ✅ USAR LOS DATOS REALES DE LA VENTA EN LUGAR DEL CARRITO LOCAL
    const numeroVenta = `V${String(ventaRealizada.id_venta).padStart(6, '0')}`;
    setNumeroVentaGenerado(numeroVenta);
    setDatosVentaConfirmada({
      ...datosCliente,
      ventaId: ventaRealizada.id_venta
    });
    
    // ✅ GUARDAR LOS DETALLES COMPLETOS DE LA VENTA INCLUYENDO EL TOTAL REAL
    setDetallesVentaReal({
      ...ventaRealizada,
      totalReal: ventaRealizada.total
    });
    
    setModalExitoAbierto(true);
    setModalClienteAbierto(false);
    
    setDatosCliente({
      nombre: '',
      ci_nit: '',
      metodo_pago: 'efectivo'
    });
  } catch (error) {
    alert('Error al realizar la venta: ' + error.message);
  }
};
// En handleVentaRapida:
const handleVentaRapida = async () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }
  
  try {
    const datosVentaRapida = {
      nombre: 'S/N',
      ci_nit: '123',
      metodo_pago: 'efectivo'
    };
    
    // ✅ CAPTURAR DATOS COMPLETOS DE LA VENTA
    const ventaRealizada = await onRealizarVenta(datosVentaRapida);
    
    //  ✅ MOSTRAR NOTIFICACIÓN SI EL CLIENTE FUE REACTIVADO
    // if (ventaRealizada.clienteReactivado) {
    //   alert('ℹ️ El cliente estaba inactivo y ha sido reactivado automáticamente.');
    // }
    
    const numeroVenta = `V${String(ventaRealizada.id_venta).padStart(6, '0')}`;
    setNumeroVentaGenerado(numeroVenta);
    setDatosVentaConfirmada({
      ...datosVentaRapida,
      ventaId: ventaRealizada.id_venta
    });
    
    // ✅ GUARDAR LOS DETALLES COMPLETOS CON TOTAL REAL
    setDetallesVentaReal({
      ...ventaRealizada,
      totalReal: ventaRealizada.total
    });
    
    setModalExitoAbierto(true);
  } catch (error) {
    alert('Error al realizar la venta rápida: ' + error.message);
  }
};

// ✅ AGREGAR ESTADO PARA LOS DETALLES REALES DE LA VENTA

  const handleChange = (name, value) => {
    setDatosCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const abrirModalVenta = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    setModalClienteAbierto(true);
  };
  

  const cerrarModalExito = () => {
    setModalExitoAbierto(false);
    onVaciarCarrito();
    onCancel();
  };
  // ✅ FUNCIÓN MEJORADA PARA GENERAR PDF CON DATOS REALES
const generarPDFConDatosReales = () => {
  if (!detallesVentaReal) {
    console.error('No hay detalles de venta disponibles');
    return;
  }

  // ✅ USAR LOS DATOS REALES DE LA VENTA EN LUGAR DEL CARRITO
  generarPDFVenta(
    datosVentaConfirmada,
    detallesVentaReal.productosVendidos || carrito,
    detallesVentaReal.total || totalVenta,
    numeroVentaGenerado
  );
};

// ✅ FUNCIÓN MEJORADA PARA IMPRIMIR CON DATOS REALES
const imprimirConDatosReales = () => {
  if (!detallesVentaReal) {
    console.error('No hay detalles de venta disponibles');
    return;
  }

  imprimirComprobante(
    datosVentaConfirmada,
    detallesVentaReal.productosVendidos || carrito, // ✅ Priorizar datos reales
    detallesVentaReal.total || totalVenta, // ✅ Priorizar total real
    numeroVentaGenerado
  );
};

  if (carrito.length === 0 && !datosVentaConfirmada) {
    return (
      <Box ta="center" py="xl">
        <ActionIcon 
          variant="subtle" 
          color="blue" 
          size="xl" 
          onClick={onCancel}
        >
          <IconShoppingCartExclamation size={80} />
        </ActionIcon>
        <Text c="dimmed" mb="lg">El carrito está vacío</Text>
        <Button onClick={onCancel} variant="light">
          Continuar Comprando
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <ScrollArea flex={1} mb="md">
          <Stack gap="sm">
            {carrito.map(item => (
              <Box 
                key={item.id} 
                p="sm" 
                style={{ 
                  border: '1px solid #e9ecef', 
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                
                <Group justify="space-between" mb="xs">
                  <Text fw={600} size="sm">{item.nombre}</Text>
                  <Badge color="blue" variant="light">
                    Bs {item.precio_venta}
                  </Badge>
                </Group>

                {/* ✅ Agregar información de stock */}
                <Text size="xs" c="dimmed" mb="xs">
                  Stock disponible: {item.stock - item.cantidad} {/* Esto sería mejor si pasamos la función */}
                </Text>
                
                {item.presentacion && (
                  <Text size="xs" c="dimmed" mb="xs">
                    {item.presentacion}
                  </Text>
                )}
                
                <Group justify="space-between">
                  <Group gap="xs">
                    <ActionIcon 
                      variant="subtle" 
                      color="red" 
                      size="sm"
                      onClick={() => onModificarCantidad(item.id, -1)}
                    >
                      <IconMinus size={14} />
                    </ActionIcon>
                    
                    <Badge variant="outline" color="blue">
                      {item.cantidad}
                    </Badge>
                    
                    <ActionIcon 
                      variant="subtle" 
                      color="green" 
                      size="sm"
                      onClick={() => onModificarCantidad(item.id, 1)}
                    >
                      <IconPlus size={14} />
                    </ActionIcon>
                  </Group>
                  
                  <Group gap="xs">
                    <Text fw={600} size="sm">
                      Bs {(item.precio_venta * item.cantidad)}
                    </Text>
                    <ActionIcon 
                      variant="subtle" 
                      color="red" 
                      size="sm"
                      onClick={() => onEliminarItem(item.id)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Box>
            ))}
          </Stack>
        </ScrollArea>

        <Box py="md" style={{ borderTop: '2px solid #e9ecef' }}>
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg">Total:</Text>
            <Text fw={700} size="xl" c="blue.6">
              Bs {totalVenta}
            </Text>
          </Group>
        </Box>

        <Stack gap>
          <Group grow>
            <Button 
              onClick={abrirModalVenta}
              size="md"
              fullWidth
            >
              <IconReceiptDollar size={16} />
              Venta
            </Button>

            <Button 
              onClick={handleVentaRapida}
              size="md"
              fullWidth
              variant="light"
            >
              <IconInvoice size={16} />
              Venta Rápida
            </Button>
          </Group>
          <Flex gap="md" justify="center" align="flex-start" direction="row" wrap="wrap">
            <Button 
              variant="light" 
              onClick={onVaciarCarrito}
              size="md"
            >
              <IconTrash size={16} />
              Vaciar
            </Button>
          </Flex>
        </Stack>
      </Box>

      {/* Modal Datos del Cliente */}


{/* Modal Datos del Cliente */}
<Modal
  opened={modalClienteAbierto}
  onClose={() => setModalClienteAbierto(false)}
  title={
    <Group gap="sm">
      <IconUser size={20} />
      <Text fw={600}>Datos del Cliente</Text>
    </Group>
  }
  size="md"
  overlayProps={{ opacity: 0.5, blur: 4 }}
  styles={{ content: { borderRadius: '12px' } }}
>
  <Box component="form" onSubmit={handleSubmit}>
    <Stack gap="md">
      <TextInput
        label="Nombre del Cliente"
        placeholder="Ingrese nombre completo"
        value={datosCliente.nombre}
        onChange={(e) => {
          const valor = e.target.value;
          // Validar solo letras, espacios y algunos caracteres especiales
          if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]*$/.test(valor) && valor.length <= 100) {
            handleChange('nombre', valor);
          }
        }}
        onBlur={(e) => {
          const valor = e.target.value.trim();
          handleChange('nombre', valor);
        }}
        error={
          datosCliente.nombre && datosCliente.nombre.length < 2 
            ? 'El nombre debe tener al menos 2 caracteres' 
            : null
        }
        required
      />
      
      <TextInput
        label="CI / NIT"
        placeholder="Número de identificación"
        value={datosCliente.ci_nit}
        onChange={(e) => {
          const valor = e.target.value;
          // Validar solo números y letras, máximo 15 caracteres
          if (/^[0-9a-zA-Z]*$/.test(valor) && valor.length <= 15) {
            handleChange('ci_nit', valor);
          }
        }}
        onBlur={(e) => {
          const valor = e.target.value.trim();
          handleChange('ci_nit', valor);
        }}
        error={
          datosCliente.ci_nit && datosCliente.ci_nit.length < 3 
            ? 'El CI/NIT debe tener al menos 3 caracteres' 
            : datosCliente.ci_nit && !/^[0-9a-zA-Z]+$/.test(datosCliente.ci_nit)
            ? 'Solo se permiten números y letras'
            : null
        }
      />
      
      <Select
        label="Método de Pago"
        placeholder="Seleccione método"
        data={[
          { value: 'efectivo', label: 'Efectivo' },
          { value: 'qr', label: 'QR' },
          { value: 'mixto', label: 'Mixto' }
        ]}
        value={datosCliente.metodo_pago}
        onChange={(value) => handleChange('metodo_pago', value)}
        required
      />

      {/* Mostrar advertencias de validación */}
      {datosCliente.nombre && datosCliente.nombre.length < 2 && (
        <Alert variant="light" color="yellow" size="sm">
          El nombre debe tener al menos 2 caracteres
        </Alert>
      )}

      {datosCliente.ci_nit && datosCliente.ci_nit.length < 3 && (
        <Alert variant="light" color="yellow" size="sm">
          El CI/NIT debe tener al menos 3 caracteres
        </Alert>
      )}

      <Group justify="space-between" mt="md">
        <Text fw={700} size="lg">Total a Pagar:</Text>
        <Text fw={700} size="xl" c="blue.6">
          Bs {totalVenta}
        </Text>
      </Group>

      {/* Función para validar si el formulario está listo para enviar */}
      {(() => {
        const nombreValido = datosCliente.nombre && datosCliente.nombre.length >= 2;
        const ciNitValido = !datosCliente.ci_nit || (datosCliente.ci_nit.length >= 3 && /^[0-9a-zA-Z]+$/.test(datosCliente.ci_nit));
        const metodoPagoValido = datosCliente.metodo_pago;
        
        const formularioValido = nombreValido && ciNitValido && metodoPagoValido;
        
        return (
          <Group grow mt="md">
            <Button 
              type="submit" 
              color="green"
              size="md"
              disabled={!formularioValido}
            >
              Confirmar Venta
            </Button>
            
            <Button 
              variant="light" 
              color="gray"
              onClick={() => setModalClienteAbierto(false)}
              size="md"
            >
              Cancelar
            </Button>
          </Group>
        );
      })()}
    </Stack>
  </Box>
</Modal>

      {/* Modal Éxito y Opciones */}
      {datosVentaConfirmada && (
        <Modal
          opened={modalExitoAbierto}
          onClose={cerrarModalExito}
          title={
            <Group gap="sm">
              <IconCheck size={20} color="green" />
              <Text fw={600}>¡Venta Realizada!</Text>
            </Group>
          }
          size="auto" 
          centered
        >
          <Stack gap="md">
            

          <Box
            p="md"
            style={{
              border: '2px solid #1871c1',
              borderRadius: '8px',
              backgroundColor: '#f0f7ff'
            }}
          >
            <Text fw={600} mb="xs">Nro. Venta: #{numeroVentaGenerado}</Text>
            <Text size="sm" c="dimmed">Cliente: {datosVentaConfirmada.nombre}</Text>
            <Text size="sm" c="dimmed">
              Total: Bs {detallesVentaReal?.totalReal?.toFixed(2) || totalVenta.toFixed(2)}
            </Text>
          </Box>

            <Group grow>
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={generarPDFConDatosReales}
              >
                Descargar PDF
              </Button>
              
              <Button
                leftSection={<IconPrinter size={16} />}
                variant="light"
                onClick={imprimirConDatosReales}
              >
                Imprimir
              </Button>
            </Group>

          </Stack>
          <br/>
          <Flex
            
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Button
              onClick={cerrarModalExito}
              variant="light"
            >
              Continuar
            </Button>
          </Flex>

        </Modal>
      )}
    </>
  );
}

export default VentaForm;