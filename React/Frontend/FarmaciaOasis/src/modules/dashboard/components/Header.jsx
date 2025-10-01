import { useState, useEffect } from 'react';

function Header() {
const [fechaHora, setFechaHora] = useState({
    fecha: '',
    hora: ''
});

useEffect(() => {
    const actualizarFechaHora = () => {
    const ahora = new Date();
    
    // Formatear fecha
    const opcionesFecha = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);
    
    // Formatear hora
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');
    const hora = `${horas}:${minutos}:${segundos}`;
    
    setFechaHora({ fecha, hora });
    };

    actualizarFechaHora();
    const intervalo = setInterval(actualizarFechaHora, 1000);

    return () => clearInterval(intervalo);
}, []);

return (
    <div className="dashboard-header">
    <div className="logoContainer">
        <img src="/img/logo.png" alt="Logo Farmacia" className="logo2" />
    </div>
    <div className="fecha-hora">
        <div className="fecha">{fechaHora.fecha}</div>
        <div className="hora">{fechaHora.hora}</div>
    </div>
    </div>
);
}

export default Header;