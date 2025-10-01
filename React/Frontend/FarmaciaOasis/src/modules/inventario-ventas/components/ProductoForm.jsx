import { useState, useEffect } from 'react';

function ProductoForm({ producto, laboratorios, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    codigo: '',
    lote: '',
    nombre: '',
    complemento: '',
    precio_base: '',
    porcentaje_g: '',
    stock: '',
    fecha_expiracion: '',
    laboratorio: ''
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo,
        lote: producto.lote,
        nombre: producto.nombre,
        complemento: producto.complemento,
        precio_base: producto.precio_base,
        porcentaje_g: producto.porcentaje_g,
        stock: producto.stock,
        fecha_expiracion: producto.fecha_expiracion,
        laboratorio: producto.laboratorio
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-producto">
      <h3>{producto ? 'Modificar Producto' : 'Agregar Producto'}</h3>
      
      <input
        name="codigo"
        value={formData.codigo}
        onChange={handleChange}
        placeholder="Código"
        required
      />
      
      <input
        name="lote"
        value={formData.lote}
        onChange={handleChange}
        placeholder="Lote"
        required
      />
      
      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />
      
      <input
        name="complemento"
        value={formData.complemento}
        onChange={handleChange}
        placeholder="Complemento"
      />
      
      <input
        type="number"
        name="precio_base"
        value={formData.precio_base}
        onChange={handleChange}
        placeholder="Precio Base"
        step="0.01"
        required
      />
      
      <input
        type="number"
        name="porcentaje_g"
        value={formData.porcentaje_g}
        onChange={handleChange}
        placeholder="Porcentaje Ganancia"
        required
      />
      
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Stock"
        required
      />
      
      <input
        type="date"
        name="fecha_expiracion"
        value={formData.fecha_expiracion}
        onChange={handleChange}
        required
      />
      
      <select
        name="laboratorio"
        value={formData.laboratorio}
        onChange={handleChange}
        required
      >
        <option value="">Seleccionar laboratorio</option>
        {laboratorios.map(lab => (
          <option key={lab.id} value={lab.nombre}>
            {lab.nombre}
          </option>
        ))}
      </select>

      <div className="form-botones">
        <button type="submit" className="btn-primario">
          {producto ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secundario">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;