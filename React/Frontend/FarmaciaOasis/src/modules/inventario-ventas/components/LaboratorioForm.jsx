import { useState } from 'react';

function LaboratorioForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nombre: '', direccion: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form-laboratorio">
      <h3>Agregar Laboratorio</h3>
      
      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre del laboratorio"
        required
      />
      
      <input
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        placeholder="Dirección"
        required
      />

      <div className="form-botones">
        <button type="submit" className="btn-primario">
          Agregar Laboratorio
        </button>
        <button type="button" onClick={onCancel} className="btn-secundario">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default LaboratorioForm;