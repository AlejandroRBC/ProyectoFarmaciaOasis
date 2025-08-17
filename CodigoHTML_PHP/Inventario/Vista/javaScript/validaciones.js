document.addEventListener('DOMContentLoaded', () => {
  function validarCampo(input, condicion) {
    if (condicion) {
      input.classList.add('error');
      input.classList.remove('ok');
    } else {
      input.classList.remove('error');
      input.classList.add('ok');
    }
  }

  // FORM MODIFICAR
  const formModificar = document.querySelector('#modalModificar form');
  if (formModificar) {
    const precioInput = document.getElementById('mod_precio');
    const stockInput  = document.getElementById('mod_stock');

    precioInput.addEventListener('input', () => {
      validarCampo(precioInput, isNaN(parseFloat(precioInput.value)) || parseFloat(precioInput.value) <= 0);
    });
    stockInput.addEventListener('input', () => {
      validarCampo(stockInput, isNaN(parseInt(stockInput.value)) || parseInt(stockInput.value) < 0);
    });

    formModificar.addEventListener('submit', (e) => {
      let errores = [];
      validarCampo(precioInput, isNaN(parseFloat(precioInput.value)) || parseFloat(precioInput.value) <= 0)
        && errores.push('Precio inválido');
      validarCampo(stockInput, isNaN(parseInt(stockInput.value)) || parseInt(stockInput.value) < 0)
        && errores.push('Stock inválido');

      if (errores.length) { e.preventDefault(); alert('Errores:\n' + errores.join('\n')); }
    });
  }

  // FORM AGREGAR
  const formAgregar = document.querySelector('#modalAgregar form');
  if (formAgregar) {
    const precioInput = formAgregar.querySelector('input[name="precio"]');
    const stockInput  = formAgregar.querySelector('input[name="stock"]');

    precioInput.addEventListener('input', () => {
      validarCampo(precioInput, isNaN(parseFloat(precioInput.value)) || parseFloat(precioInput.value) <= 0);
    });
    stockInput.addEventListener('input', () => {
      validarCampo(stockInput, isNaN(parseInt(stockInput.value)) || parseInt(stockInput.value) < 0);
    });

    formAgregar.addEventListener('submit', (e) => {
      let errores = [];
      validarCampo(precioInput, isNaN(parseFloat(precioInput.value)) || parseFloat(precioInput.value) <= 0)
        && errores.push('Precio inválido');
      validarCampo(stockInput, isNaN(parseInt(stockInput.value)) || parseInt(stockInput.value) < 0)
        && errores.push('Stock inválido');

      if (errores.length) { e.preventDefault(); alert('Errores:\n' + errores.join('\n')); }
    });
  }

  // FORM DATOS CLIENTE
  const formCliente = document.querySelector('#modalCompra form');
  if (formCliente) {
    const ciNitField = formCliente.querySelector('input[name="ci_nit"]');
    const regex = /^\d{7,12}$/;

    ciNitField.addEventListener('input', () => {
      validarCampo(ciNitField, !regex.test(ciNitField.value.trim().replace(/[\s-]/g, '')));
    });

    formCliente.addEventListener('submit', (e) => {
      let errores = [];
      validarCampo(ciNitField, !regex.test(ciNitField.value.trim().replace(/[\s-]/g, '')))
        && errores.push('CI/NIT inválido');

      if (errores.length) { e.preventDefault(); alert('Errores:\n' + errores.join('\n')); }
    });
  }
});