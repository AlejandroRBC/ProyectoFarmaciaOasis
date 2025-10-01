import { useState } from 'react';

export const useNavbar = () => {
  const [esMenuAbierto, setEsMenuAbierto] = useState(false);

  const abrirMenu = () => {
    setEsMenuAbierto(true);
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = 'hidden';
  };

  const cerrarMenu = () => {
    setEsMenuAbierto(false);
    // Restaurar scroll del body
    document.body.style.overflow = 'unset';
  };

  const toggleMenu = () => {
    if (esMenuAbierto) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  };

  return {
    esMenuAbierto,
    abrirMenu,
    cerrarMenu,
    toggleMenu
  };
};