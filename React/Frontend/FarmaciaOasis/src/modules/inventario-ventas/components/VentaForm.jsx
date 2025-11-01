import { useState, useEffect } from 'react';
import { 
  ScrollArea, Box, Group, Text, Button, ActionIcon,Flex, ThemeIcon,Badge,Stack,Modal,TextInput, Select,Alert, Radio
} from '@mantine/core';
import { 
  IconPlus, IconMinus, IconTrash, IconUser,IconShoppingCartExclamation,IconReceiptDollar,IconInvoice,IconDownload,IconPrinter,IconCheck, IconQrcode, IconCash, IconCurrencyDollar
} from '@tabler/icons-react';
import { generarPDFVenta,
  imprimirComprobante } from '../utils/generarPDF';
import clienteService from '../services/clienteService';

function VentaForm({ 
  carrito, 
  totalVenta, 
  totalSinDescuento,  // ✅ NUEVO
  montoDescuento,     // ✅ NUEVO
  descuentoCliente,   // ✅ NUEVO
  onModificarCantidad, 
  onEliminarItem, 
  onVaciarCarrito, 
  onRealizarVenta, 
  onCancel,
  onActualizarDescuento 
}) {
  
  const [detallesVentaReal, setDetallesVentaReal] = useState(null);
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
  const [modalPagoRapidoAbierto, setModalPagoRapidoAbierto] = useState(false);
  const [datosVentaConfirmada, setDatosVentaConfirmada] = useState(null);
  const [numeroVentaGenerado, setNumeroVentaGenerado] = useState('');
  const [metodoPagoRapido, setMetodoPagoRapido] = useState('efectivo');
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    ci_nit: '',
    metodo_pago: 'efectivo'
  });

  
// ✅ NUEVO: Función para manejar la búsqueda de cliente con descuento
const buscarClientePorCI = async (ci_nit) => {
  if (!ci_nit || ci_nit.length < 3) {
    return;
  }

  setBuscandoCliente(true);
  try {
    const cliente = await clienteService.buscarClientePorCIExacto(ci_nit);
    if (cliente) {
      // ✅ Autocompletar datos del cliente encontrado
      setDatosCliente(prev => ({
        ...prev,
        nombre: cliente.nombre,
        ci_nit: cliente.ci_nit
      }));
      
      // ✅ Actualizar el descuento en el carrito
      if (onActualizarDescuento) {
        onActualizarDescuento(cliente.descuento || 0);
      }
      
      console.log('Cliente encontrado:', cliente.nombre, 'Descuento:', cliente.descuento + '%');
    } else {
      // ✅ Si no se encuentra cliente, resetear descuento
      if (onActualizarDescuento) {
        onActualizarDescuento(0);
      }
    }
  } catch (error) {
    console.error('Error al buscar cliente:', error);
  } finally {
    setBuscandoCliente(false);
  }
};

  // ✅ NUEVO: useEffect para buscar automáticamente cuando cambia el CI
  useEffect(() => {
    const timer = setTimeout(() => {
      if (datosCliente.ci_nit && datosCliente.ci_nit.length >= 3) {
        buscarClientePorCI(datosCliente.ci_nit);
      }
    }, 800); // Esperar 800ms después de que el usuario deje de escribir

    return () => clearTimeout(timer);
  }, [datosCliente.ci_nit]);

  // En handleSubmit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    try {
      const ventaRealizada = await onRealizarVenta(datosCliente);
      
      if (ventaRealizada.clienteReactivado) {
        alert('ℹ️ El cliente estaba inactivo y ha sido reactivado automáticamente.');
      }
      
      const numeroVenta = `V${String(ventaRealizada.id_venta).padStart(6, '0')}`;
      setNumeroVentaGenerado(numeroVenta);
      setDatosVentaConfirmada({
        ...datosCliente,
        ventaId: ventaRealizada.id_venta
      });
      
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

  // ✅ NUEVA FUNCIÓN MEJORADA PARA VENTA RÁPIDA
  const handleVentaRapida = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    setModalPagoRapidoAbierto(true);
  };

  // ✅ NUEVA FUNCIÓN PARA CONFIRMAR VENTA RÁPIDA CON MÉTODO DE PAGO
  const confirmarVentaRapida = async () => {
    try {
      const datosVentaRapida = {
        nombre: 'S/N',
        ci_nit: '123',
        metodo_pago: metodoPagoRapido 
      };
      
      const ventaRealizada = await onRealizarVenta(datosVentaRapida);
      
      const numeroVenta = `V${String(ventaRealizada.id_venta).padStart(6, '0')}`;
      setNumeroVentaGenerado(numeroVenta);
      setDatosVentaConfirmada({
        ...datosVentaRapida,
        ventaId: ventaRealizada.id_venta
      });
      
      setDetallesVentaReal({
        ...ventaRealizada,
        totalReal: ventaRealizada.total
      });
      
      setModalExitoAbierto(true);
      setModalPagoRapidoAbierto(false);
    } catch (error) {
      alert('Error al realizar la venta rápida: ' + error.message);
      setModalPagoRapidoAbierto(false);
    }
  };

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

    generarPDFVenta(
      datosVentaConfirmada,
      detallesVentaReal.productosVendidos || carrito,
      detallesVentaReal.total || totalVenta,
      numeroVentaGenerado,
      {
        totalSinDescuento: detallesVentaReal.total_sin_descuento || totalSinDescuento,
        montoDescuento: detallesVentaReal.descuento_aplicado || montoDescuento,
        porcentajeDescuento: detallesVentaReal.porcentaje_descuento || descuentoCliente
      }
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
      detallesVentaReal.productosVendidos || carrito,
      detallesVentaReal.total || totalVenta,
      numeroVentaGenerado,
      {
        totalSinDescuento: detallesVentaReal.total_sin_descuento || totalSinDescuento,
        montoDescuento: detallesVentaReal.descuento_aplicado || montoDescuento,
        porcentajeDescuento: detallesVentaReal.porcentaje_descuento || descuentoCliente
      }
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
          Continuar Vendiendo
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

                {item.presentacion && (
                  <Text size="xs" c="dimmed" mb="xs">
                    {item.presentacion} - {item.medida}
                  </Text>
                )}
                <Text size="xs" c="dimmed" mb="xs">
                  Stock disponible: {item.stock - item.cantidad}
                </Text>
                
                
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

      {/* Modal Datos del Cliente (MEJORADO) */}
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
              label="CI / NIT"
              placeholder="Ingrese CI o NIT del cliente"
              value={datosCliente.ci_nit}
              onChange={(e) => {
                const valor = e.target.value;
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
              required
              rightSection={buscandoCliente ? <Text size="xs" c="blue">Buscando...</Text> : null}
            />
            
            <TextInput
              label="Nombre del Cliente"
              placeholder="Se autocompletará si el cliente existe"
              value={datosCliente.nombre}
              onChange={(e) => {
                const valor = e.target.value;
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
            <Radio.Group
            value={datosCliente.metodo_pago}
            onChange={(value) => handleChange('metodo_pago', value)}
            
            label="Seleccione el método de pago:"
            withAsterisk
          >
            <Stack mt="xs" gap="sm">
              <Radio 
                value="efectivo" 
                label={
                  <Group gap="sm">
                    <IconCash size={18} color="green" />
                    <Text>Efectivo</Text>
                  </Group>
                } 
              />
              <Radio 
                value="qr" 
                label={
                  <Group gap="sm">
                    <IconQrcode size={18} color="blue" />
                    <Text>QR</Text>
                  </Group>
                } 
              />
              <Radio 
                value="mixto" 
                label={
                  <Group gap="sm">
                    <IconCurrencyDollar size={18} color="orange" />
                    <Text>Mixto</Text>
                  </Group>
                } 
              />
            </Stack>
          </Radio.Group>

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

            {(() => {
              const nombreValido = datosCliente.nombre && datosCliente.nombre.length >= 2;
              const ciNitValido = datosCliente.ci_nit && datosCliente.ci_nit.length >= 3 && /^[0-9a-zA-Z]+$/.test(datosCliente.ci_nit);
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

      {/* Modal para Selección de Pago en Venta Rápida */}
      <Modal
        opened={modalPagoRapidoAbierto}
        onClose={() => setModalPagoRapidoAbierto(false)}
        title={
          <Group gap="sm">
            <IconCurrencyDollar size={20} />
            <Text fw={600}>Método de Pago - Venta Rápida</Text>
          </Group>
        }
        size="sm"
        overlayProps={{ opacity: 0.5, blur: 4 }}
        styles={{ content: { borderRadius: '12px' } }}
      >
        <Stack gap="lg">
        <Box py="md" style={{ borderTop: '2px solid #e9ecef' }}>
    {descuentoCliente > 0 && (
      <>
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">Subtotal:</Text>
          <Text size="sm" c="dimmed">Bs {totalSinDescuento?.toFixed(2)}</Text>
        </Group>
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="green">Descuento ({descuentoCliente}%):</Text>
          <Text size="sm" c="green">- Bs {montoDescuento?.toFixed(2)}</Text>
        </Group>
      </>
    )}
    <Group justify="space-between" mb="md">
      <Text fw={700} size="lg">Total:</Text>
      <Text fw={700} size="xl" c="blue.6">
        Bs {totalVenta?.toFixed(2)}
      </Text>
    </Group>
  </Box>

          <Radio.Group
            value={metodoPagoRapido}
            onChange={setMetodoPagoRapido}
            name="metodoPagoRapido"
            label="Seleccione el método de pago:"
            withAsterisk
          >
            <Stack mt="xs" gap="sm">
              <Radio 
                value="efectivo" 
                label={
                  <Group gap="sm">
                    <IconCash size={18} color="green" />
                    <Text>Efectivo</Text>
                  </Group>
                } 
              />
              <Radio 
                value="qr" 
                label={
                  <Group gap="sm">
                    <IconQrcode size={18} color="blue" />
                    <Text>QR</Text>
                  </Group>
                } 
              />
              <Radio 
                value="mixto" 
                label={
                  <Group gap="sm">
                    <IconCurrencyDollar size={18} color="orange" />
                    <Text>Mixto</Text>
                  </Group>
                } 
              />
            </Stack>
          </Radio.Group>

          <Group grow mt="md">
            <Button 
              onClick={confirmarVentaRapida}
              color="green"
              size="md"
            >
              <IconCheck size={16} />
              Confirmar Venta
            </Button>
            
            <Button 
              variant="light" 
              color="gray"
              onClick={() => setModalPagoRapidoAbierto(false)}
              size="md"
            >
              Cancelar
            </Button>
          </Group>
        </Stack>
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
              <Text size="sm" c="dimmed">Método de Pago: {datosVentaConfirmada.metodo_pago.toUpperCase()}</Text>
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