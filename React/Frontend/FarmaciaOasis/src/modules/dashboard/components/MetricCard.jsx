function MetricCard({ valor, etiqueta, sufijo = '', color }) {
    return (
      <div 
        className="metric-card circulo" 
        style={{ backgroundColor: color }}
      >
        <span className="msjGrande">
          {typeof valor === 'number' && sufijo === 'Bs' 
            ? valor.toLocaleString('es-ES', { minimumFractionDigits: 2 })
            : valor.toLocaleString()
          }
        </span>
        <br />
        <span className="msjPeque">
          {etiqueta} {sufijo && `(${sufijo})`}
        </span>
      </div>
    );
  }
  
  export default MetricCard;