import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/inventario', label: 'Inventario', icon: '📦' },
    { path: '/historial-ventas', label: 'Historial Ventas', icon: '📊' },
    { path: '/historial-producto', label: 'Historial Producto', icon: '📋' },
    { path: '/reportes', label: 'Generar Reportes', icon: '📄' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar" onClick={(e) => e.stopPropagation()}>
      <button className="cerrar-btn" onClick={onClose}>
        &times;
      </button>
      
      <div className="menu-items">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(item.path);
            }}
          >
            <span className="menu-icon">{item.icon}</span>
            <i>{item.label}</i>
          </a>
        ))}
      </div>

      {/* Información de usuario (opcional) */}
      <div className="user-info">
        <div className="user-avatar">👤</div>
        <div className="user-details">
          <span className="user-name">Usuario Farmacia</span>
          <span className="user-role">Administrador</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;