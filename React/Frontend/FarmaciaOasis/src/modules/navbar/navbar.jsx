import { useNavbar } from './hooks/useNavbar';
import { MantineSidebar } from './components/MantineSidebar';
import { ActionIcon, Group, AppShell, Text } from '@mantine/core';
import { IconMenu2, IconBuildingStore } from '@tabler/icons-react';
import './navbar.css';

function Navbar({ children }) {
  const { esMenuAbierto, abrirMenu, cerrarMenu } = useNavbar();

  return (
    <>
      {/* Navbar Superior Mejorado */}
      <AppShell.Header className="navbar-header">
        <Group justify="space-between" h="100%" px="lg">
          <Group gap="xl">
            <ActionIcon 
              variant="gradient" 
              size="xl" 
              onClick={abrirMenu}
              className="navbar-toggle"
              gradient={{ from: 'blue.7', to: 'cyan.5' }}
            >
              <IconMenu2 size={24} />
            </ActionIcon>
            
            <Group gap="sm" className="logo-container">
              <div className="logo-wrapper">
                <img
                  src="/img/logo.png"
                  alt="Farmacia Oasis"
                  className="navbar-logo"
                />
                <div className="logo-glow"></div>
              </div>
              <div className="brand-text">
                <Text className="brand-name" fw={700}>
                  FARMACIA OASIS
                </Text>
                
              </div>
            </Group>
          </Group>
          
          <Group gap="md" className="navbar-right">
            <Group gap="xs" className="welcome-section">
              <IconBuildingStore size={20} className="welcome-icon" />
              <div className="welcome-text">
                <Text size="sm" fw={600}>Bienvenido</Text>
                <Text size="xs" opacity={0.8}>Sistema de Gestión</Text>
              </div>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <div className={`sidebar-overlay ${esMenuAbierto ? 'active' : ''}`}>
        <div className="sidebar-backdrop" onClick={cerrarMenu}></div>
        <div className="sidebar-wrapper">
          <MantineSidebar onClose={cerrarMenu} />
        </div>
      </div>

      {/* Contenido principal */}
      <AppShell.Main className="main-content">
        {children}
      </AppShell.Main>
    </>
  );
}

export default Navbar;