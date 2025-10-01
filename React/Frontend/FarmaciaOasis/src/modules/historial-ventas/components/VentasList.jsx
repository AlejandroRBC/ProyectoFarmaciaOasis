function VentasList({ ventas }) {
    const formatMetodoPago = (metodo) => {
      const metodos = {
        'efectivo': 'Efectivo',
        'qr': 'QR',
        'mixto': 'Mixto'
      };
      return metodos[metodo.toLowerCase()] || metodo;
    };
  
    const getBadgeColor = (metodo) => {
      const colores = {
        'efectivo': '#28a745',
        'qr': '#17a2b8',
        'mixto': '#6f42c1'
      };
      return colores[metodo.toLowerCase()] || '#6c757d';
    };
  
    if (ventas.length === 0) {
      return (
        <div className="sin-ventas">
          <p>No hay ventas registradas en el historial.</p>
        </div>
      );
    }
  
    return (
      <div className="containerTabla">
        <table>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>CI/NIT</th>
              <th>Método de Pago</th>
              <th>Total (Bs)</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td className="id-venta">{venta.id_venta}</td>
                <td className="fecha">
                  {new Date(venta.fecha).toLocaleDateString('es-ES')}
                </td>
                <td className="hora">{venta.hora}</td>
                <td className="cliente">{venta.nombre_cliente}</td>
                <td className="ci-nit">{venta.ci_nit}</td>
                <td className="metodo-pago">
                  <span 
                    className="badge-pago"
                    style={{ backgroundColor: getBadgeColor(venta.metodo_pago) }}
                  >
                    {formatMetodoPago(venta.metodo_pago)}
                  </span>
                </td>
                <td className="total">
                  <strong>{venta.total.toFixed(2)}</strong>
                </td>
                <td className="productos" title={venta.productos}>
                  {venta.productos.length > 50 
                    ? `${venta.productos.substring(0, 50)}...` 
                    : venta.productos
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default VentasList;