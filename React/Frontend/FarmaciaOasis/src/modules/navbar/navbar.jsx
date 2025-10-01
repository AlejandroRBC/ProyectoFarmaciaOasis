// import { useState } from 'react';
import { useNavbar } from './hooks/useNavbar';
import Sidebar from './components/Sidebar';
import './navbar.css';

function Navbar() {
  const { esMenuAbierto, abrirMenu, cerrarMenu } = useNavbar();

  return (
    <>
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
    </>
  );
}

export default Navbar;