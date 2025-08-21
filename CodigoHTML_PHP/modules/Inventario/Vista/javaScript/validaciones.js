
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
    const nombreField = formCliente.querySelector('input[name="nombre_cliente"]');


    const regexCiNit = /^\d{7,12}$/;                       
    const regexNombre = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;           

    ciNitField.addEventListener('input', () => {
      validarCampo(ciNitField, !regexCiNit.test(ciNitField.value.trim().replace(/[\s-]/g, '')));
    });

    nombreField.addEventListener('input', () => {
      validarCampo(nombreField, !regexNombre.test(nombreField.value.trim()));
    });

   
    formCliente.addEventListener('submit', (e) => {
      let errores = [];

      if (!regexCiNit.test(ciNitField.value.trim().replace(/[\s-]/g, ''))) {
        validarCampo(ciNitField, true);
        errores.push('CI/NIT inválido (solo números, 7 a 12 dígitos).');
      }

      if (!regexNombre.test(nombreField.value.trim())) {
        validarCampo(nombreField, true);
        errores.push('El nombre solo puede contener letras y espacios.');
      }

      if (errores.length) {
        e.preventDefault();
        alert('Errores:\n' + errores.join('\n'));
      }
    });
  }
});
