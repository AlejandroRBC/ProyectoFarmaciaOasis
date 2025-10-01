function ProductosVencerModal({ productos, onClose }) {
    const getAlertaClass = (dias) => {
      if (dias <= 7) return 'alerta-critica';
      if (dias <= 30) return 'alerta-advertencia';
      return 'alerta-normal';
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <span className="close-btn" onClick={onClose}>&times;</span>
            <h3>Productos por Vencer</h3>
          </div>
          
          <div className="containerTabla">
            <table>
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>LABORATORIO</th>
                  <th>FECHA VENCIMIENTO</th>
                  <th>DÍAS RESTANTES</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map(producto => (
                    <tr 
                      key={producto.id}
                      className={getAlertaClass(producto.diasRestantes)}
                    >
                      <td>{producto.nombre}</td>
                      <td>{producto.laboratorio}</td>
                      <td>
                        {new Date(producto.fechaVencimiento).toLocaleDateString('es-ES')}
                      </td>
                      <td>
                        <span className={`dias ${getAlertaClass(producto.diasRestantes)}`}>
                          {producto.diasRestantes} días
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="sin-datos">
                      No hay productos por vencer en los próximos 60 días
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="modal-footer">
            <button onClick={onClose} className="btn-cerrar">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ProductosVencerModal;