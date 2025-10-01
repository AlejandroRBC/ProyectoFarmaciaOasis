function ProductoList({ productos, onAgregarCarrito, onEditar, onEliminar }) {
    return (
    <div className="containerTabla">
        <table>
        <thead>
            <tr>
            <th>CÓDIGO</th>
            <th>LOTE</th>
            <th>NOMBRE</th>
            <th>COMPLEMENTO</th>
            <th>PRECIO BASE</th>
            <th>PRECIO VENTA</th>
            <th>STOCK</th>
            <th>FECHA EXP.</th>
            <th>LABORATORIO</th>
            <th>ACCIONES</th>
            </tr>
        </thead>
        <tbody>
            {productos.map(producto => (
            <tr key={producto.id}>
                <td>{producto.codigo}</td>
                <td>{producto.lote}</td>
                <td>{producto.nombre}</td>
                <td>{producto.complemento}</td>
                <td>{producto.precio_base} Bs</td>
                <td>{producto.precio_venta} Bs</td>
                <td>{producto.stock}</td>
                <td>{producto.fecha_expiracion}</td>
                <td>{producto.laboratorio}</td>
                <td className="acciones-celda">
                <button 
                    className="btn-agregar"
                    onClick={() => onAgregarCarrito(producto)}
                >
                    🛒
                </button>
                <button 
                    className="btn-editar"
                    onClick={() => onEditar(producto)}
                >
                    ✏️
                </button>
                <button 
                    className="btn-eliminar"
                    onClick={() => {
                    if (window.confirm(`¿Eliminar ${producto.nombre}?`)) {
                        onEliminar(producto.id);
                    }
                    }}
                >
                    🗑️
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
        {productos.length === 0 && (
        <p className="sin-productos">No hay productos disponibles</p>
        )}
    </div>
    );
}

export default ProductoList;