// components/Header.jsx - VERSIÓN MEJORADA
import { useState, useEffect, useRef } from 'react';
import { 
  Group, 
  Text, 
  ActionIcon,
  Badge,
  Menu,
  Stack,
  ThemeIcon
} from '@mantine/core';
import { 
  IconBell, 
  IconAlertTriangle,
  IconCalendarExclamation
} from '@tabler/icons-react';

function Header({ productosBajos = [], productosPorVencer = [] }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fechaHora, setFechaHora] = useState({ hora: '' });
  const [notificacionSonido, setNotificacionSonido] = useState(false);
  const audioPlayedRef = useRef(false);

  // Calcular notificaciones
  const notificacionesStock = productosBajos.filter(p => p.stock <= 5).length;
  const notificacionesVencimiento = productosPorVencer.filter(p => p.diasRestantes <= 10).length;
  const totalNotificaciones = notificacionesStock + notificacionesVencimiento;

  // Actualizar hora
  useEffect(() => {
    const actualizarFechaHora = () => {
      const ahora = new Date();
      const hora = ahora.toLocaleTimeString('es-ES');
      setFechaHora({ hora });
    };

    actualizarFechaHora();
    const intervalo = setInterval(actualizarFechaHora, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Efecto para sonido de notificación (se ejecuta en cada recarga)
  useEffect(() => {
    if (totalNotificaciones > 0 && !audioPlayedRef.current) {
      reproducirSonido();
      audioPlayedRef.current = true;
    }
  }, [totalNotificaciones]);

  const reproducirSonido = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
    } catch (error) {
      console.log('Audio no soportado');
      // Fallback simple
      try {
        const beep = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBjiN1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBjiN1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBmWf2fS7bCgF");
        beep.volume = 0.3;
        beep.play().catch(e => console.log('No se pudo reproducir sonido'));
      } catch (e) {
        console.log('Sonido no disponible');
      }
    }
  };

  return (
    <div style={{ 
      background: 'transparent',
      padding: '16px 0',
      position: 'relative'
    }}>
      <Group justify="center" align="center">
        {/* Título Centrado */}
        <Stack gap={2} align="center">
          <Text 
            fw={900} 
            size="32px" 
            c="blue.6"
            style={{
              background: 'linear-gradient(135deg, #034C8C 0%, #0277BD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            MÉTRICAS
          </Text>
          <Text 
            size="lg" 
            c="dimmed" 
            fw={500}
            style={{ letterSpacing: '1px' }}
          >
            Dashboard de Gestión
          </Text>
        </Stack>

        {/* Notificaciones - Posicionada a la derecha SIN CONTENEDOR */}
        {/* Notificaciones - Campanita 100% transparente */}
{/* Notificaciones - Campanita con contenedor más grande */}
<Menu 
  shadow="md" 
  width={350} 
  position="bottom-end"
  opened={menuAbierto}
  onChange={setMenuAbierto}
>
  <Menu.Target>
    <ActionIcon 
      variant="subtle" 
      color="blue" 
      size="xl" 
      style={{ 
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        width: '50px',
        height: '50px'
      }}
    >
      <IconBell size={25} />
      
      {totalNotificaciones > 0 && (
        <Badge 
          size ="sm" 
          circle 
          color="red" 
          variant="filled"
          style={{ 
            position: 'absolute',
            top: '5px',
            right: '5px',
            minWidth: '10px',
            minHeight: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: totalNotificaciones > 0 ? 'pulse 2s infinite' : 'none'
          }}
        >
          {totalNotificaciones}
        </Badge>
      )}
    </ActionIcon>
  </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>🔔 Sistema de Alertas</span>
              {totalNotificaciones > 0 && (
                <Badge color="red" variant="light" size="lg">
                  {totalNotificaciones}
                </Badge>
              )}
            </Menu.Label>

            <Menu.Divider />

            {/* ALERTA STOCK BAJO */}
            {notificacionesStock > 0 ? (
              <Menu.Item 
                style={{ padding: '12px' }}
                leftSection={
                  <ThemeIcon color="orange" size="lg" variant="light">
                    <IconAlertTriangle size={18} />
                  </ThemeIcon>
                }
              >
                <div>
                  <Text fw={700} size="md">Stock Crítico</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    {notificacionesStock} productos con stock ≤ 5 unidades
                  </Text>
                </div>
              </Menu.Item>
            ) : (
              <Menu.Item style={{ padding: '12px' }}>
                <div>
                  <Text fw={600} c="green">✅ Stock Normal</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    Sin productos con stock crítico
                  </Text>
                </div>
              </Menu.Item>
            )}

            {/* ALERTA VENCIMIENTO */}
            {notificacionesVencimiento > 0 ? (
              <Menu.Item 
                style={{ padding: '12px' }}
                leftSection={
                  <ThemeIcon color="red" size="lg" variant="light">
                    <IconCalendarExclamation size={18} />
                  </ThemeIcon>
                }
              >
                <div>
                  <Text fw={700} size="md">Vencimiento Próximo</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    {notificacionesVencimiento} productos por vencer en ≤ 10 días
                  </Text>
                </div>
              </Menu.Item>
            ) : (
              <Menu.Item style={{ padding: '12px' }}>
                <div>
                  <Text fw={600} c="green">✅ Vencimientos OK</Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    Sin productos por vencer pronto
                  </Text>
                </div>
              </Menu.Item>
            )}

            <Menu.Divider />
            
            <Menu.Item style={{ padding: '8px' }}>
              <Text size="xs" c="dimmed" ta="center">
                Actualizado: {fechaHora.hora}
              </Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      {/* Estilos para la animación de pulso */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: translate(25%, -25%) scale(1); }
            50% { transform: translate(25%, -25%) scale(1.1); }
            100% { transform: translate(25%, -25%) scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default Header;