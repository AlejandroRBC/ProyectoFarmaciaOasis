function ProductosBajosModal({ productos, onClose }) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <span className="close-btn" onClick={onClose}>&times;</span>
            <h3>Productos por Acabarse</h3>
          </div>
          
          <div className="containerTabla">
            <table>
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>STOCK</th>
                  <th>ESTADO</th>
                  <th>LABORATORIO</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map(producto => (
                    <tr 
                      key={producto.id}
                      className={`fila-estado ${producto.estado.toLowerCase()}`}
                    >
                      <td>{producto.nombre}</td>
                      <td>{producto.stock}</td>
                      <td>
                        <span className={`badge ${producto.estado.toLowerCase()}`}>
                          {producto.estado}
                        </span>
                      </td>
                      <td>{producto.laboratorio}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="sin-datos">
                      No hay productos con stock bajo
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
  
  export default ProductosBajosModal;