document.addEventListener('DOMContentLoaded', () => {
  // Validar Form modificar
  const formModificar = document.querySelector('#modalModificar form');
  if (formModificar) {
    formModificar.addEventListener('submit', (e) => {
      const precio = parseFloat(document.getElementById('mod_precio').value);
      const stock = parseInt(document.getElementById('mod_stock').value);
      let errores = [];
      if (isNaN(precio) || precio <= 0) errores.push('El precio debe ser mayor a 0.');
      if (isNaN(stock) || stock < 0) errores.push('El stock no puede ser negativo.');

      if (errores.length) {
        e.preventDefault();
        alert('Errores en MODIFICAR producto:\n' + errores.join('\n'));
      }
    });
  }

  // Validar Form agregar
  const formAgregar = document.querySelector('#modalAgregar form');
  if (formAgregar) {
    formAgregar.addEventListener('submit', (e) => {
      const precio = parseFloat(formAgregar.querySelector('input[name="precio"]').value);
      const stock = parseInt(formAgregar.querySelector('input[name="stock"]').value);
      let errores = [];
      if (isNaN(precio) || precio <= 0) errores.push('El precio debe ser mayor a 0.');
      if (isNaN(stock) || stock < 0) errores.push('El stock no puede ser negativo.');

      if (errores.length) {
        e.preventDefault();
        alert('Errores en AGREGAR producto:\n' + errores.join('\n'));
      }
    });
  }
});
// Validar Form datos cliente
const form = document.querySelector('#modalCompra form');

  form.addEventListener('submit', (e) => {
    
    const ciNitInput = form.querySelector('input[name="ci_nit"]').value.trim();
    const ciNitLimpio = ciNitInput.replace(/[\s-]/g, '');
    const regex = /^\d{7,12}$/;

      if (!regex.test(ciNitLimpio)) {
        e.preventDefault();
        alert('El CI / NIT debe tener entre 7 y 12 dígitos numéricos, sin letras ni caracteres especiales.');
        form.querySelector('input[name="ci_nit"]').focus();
      }
  });