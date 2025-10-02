import { useNavbar } from './hooks/useNavbar';
import Sidebar from './components/Sidebar';
import './navbar.css';

function Navbar({ children }) {
  const { esMenuAbierto, abrirMenu, cerrarMenu } = useNavbar();

  return (
    <div className="layout">
      {/* Navbar Principal */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          <img src="/img/logo.png" alt="Farmacia Oasis" className="logo" />
        </a>

        <div className="navbar-palanca" onClick={abrirMenu}>
          <span>☰</span>
        </div>
      </nav>

      {/* Overlay y Sidebar */}
      <div 
        className={`overlay-menu ${esMenuAbierto ? 'active' : ''}`}
        onClick={cerrarMenu}
      >
        <Sidebar onClose={cerrarMenu} />
      </div>

      {/* Contenido principal */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Navbar;
