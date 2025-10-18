import { 
  TextInput, 
  NumberInput,
  Button, 
  Stack,
  Group,
<<<<<<< HEAD
  Text
=======
  Text,
  Alert
>>>>>>> main
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { IconAlertCircle, IconLock } from '@tabler/icons-react';

export function ProveedorForm({ 
  proveedor, 
  onGuardar,
  isMobile = false
}) {
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});

  const form = useForm({
    initialValues: {
      nombre: '',
      telefono: '',
      cantidad: 0,
      concepto: '',
      precio_unitario: 0,
      precio_total: 0,
<<<<<<< HEAD
    },
    validate: {
      nombre: (value) => {
        if (!value) return 'Nombre es requerido';
        if (value.length < 2) return 'Nombre debe tener al menos 2 caracteres';
        if (value.length > 100) return 'Nombre muy largo (máx. 100 caracteres)';
        return null;
      },
      telefono: (value) => {
        if (!value) return 'Teléfono es requerido';
        if (value.length < 6) return 'Teléfono debe tener al menos 6 caracteres';
        if (value.length > 20) return 'Teléfono muy largo (máx. 20 caracteres)';
        return null;
      },
      cantidad: (value) => {
        if (value < 0) return 'Cantidad no puede ser negativa';
        if (!Number.isInteger(Number(value))) return 'Cantidad debe ser un número entero';
        return null;
      },
      concepto: (value) => {
        if (!value) return 'Concepto es requerido';
        if (value.length < 3) return 'Concepto debe tener al menos 3 caracteres';
        return null;
      },
      precio_unitario: (value) => {
        if (value < 0) return 'Precio unitario no puede ser negativo';
        if (!Number.isFinite(value)) return 'Precio unitario debe ser un número válido';
        return null;
      },
      precio_total: (value) => {
        if (value < 0) return 'Precio total no puede ser negativo';
        if (!Number.isFinite(value)) return 'Precio total debe ser un número válido';
        return null;
      },
    },
=======
    }
>>>>>>> main
  });

  // Función para verificar si el formulario es válido
  const esFormularioValido = () => {
    const { nombre, telefono, concepto } = form.values;
    
    // Campos obligatorios no vacíos
    if (!nombre.trim() || !telefono.trim() || !concepto.trim()) {
      return false;
    }
    
    // Sin errores de validación
    if (Object.keys(errores).length > 0) {
      return false;
    }
    
    // Longitudes mínimas
    if (nombre.length < 2 || telefono.length < 6 || concepto.length < 3) {
      return false;
    }
    
    return true;
  };

  // Función de validación
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };
    
    switch (nombre) {
      case 'nombre':
        if (!valor.trim()) {
          nuevosErrores.nombre = 'El nombre del proveedor es requerido';
        } else if (valor.length < 2) {
          nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (valor.length > 100) {
          nuevosErrores.nombre = 'El nombre no puede tener más de 100 caracteres';
        } else {
          delete nuevosErrores.nombre;
        }
        break;

      case 'telefono':
        if (!valor.trim()) {
          nuevosErrores.telefono = 'El teléfono es requerido';
        } else if (valor.length < 6) {
          nuevosErrores.telefono = 'El teléfono debe tener al menos 6 caracteres';
        } else if (valor.length > 20) {
          nuevosErrores.telefono = 'El teléfono no puede tener más de 20 caracteres';
        } else {
          delete nuevosErrores.telefono;
        }
        break;

      case 'cantidad':
        if (valor < 0) {
          nuevosErrores.cantidad = 'La cantidad no puede ser negativa';
        } else if (!Number.isInteger(Number(valor))) {
          nuevosErrores.cantidad = 'La cantidad debe ser un número entero';
        } else {
          delete nuevosErrores.cantidad;
        }
        break;

      case 'concepto':
        if (!valor.trim()) {
          nuevosErrores.concepto = 'El concepto es requerido';
        } else if (valor.length < 3) {
          nuevosErrores.concepto = 'El concepto debe tener al menos 3 caracteres';
        } else if (valor.length > 200) {
          nuevosErrores.concepto = 'El concepto no puede tener más de 200 caracteres';
        } else {
          delete nuevosErrores.concepto;
        }
        break;

      case 'precio_unitario':
        if (valor < 0) {
          nuevosErrores.precio_unitario = 'El precio unitario no puede ser negativo';
        } else if (!Number.isFinite(valor)) {
          nuevosErrores.precio_unitario = 'El precio unitario debe ser un número válido';
        } else {
          delete nuevosErrores.precio_unitario;
        }
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (name, value) => {
    form.setFieldValue(name, value);

    if (tocado[name]) {
      validarCampo(name, value);
    }
  };

  const handleBlur = (name, value) => {
    setTocado(prev => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  const validarFormulario = () => {
    const nuevosTocados = {};
    Object.keys(form.values).forEach(key => {
      nuevosTocados[key] = true;
    });
    setTocado(nuevosTocados);

    Object.keys(form.values).forEach(key => {
      validarCampo(key, form.values[key]);
    });

    return Object.keys(errores).length === 0 && esFormularioValido();
  };

  useEffect(() => {
    if (proveedor) {
      form.setValues({
        nombre: proveedor.nombre || '',
        telefono: proveedor.telefono || '',
        cantidad: proveedor.cantidad || 0,
        concepto: proveedor.concepto || '',
        precio_unitario: proveedor.precio_unitario || 0,
        precio_total: proveedor.precio_total || 0,
      });
    } else {
      form.reset();
      setErrores({});
      setTocado({});
    }
  }, [proveedor]);

<<<<<<< HEAD
  // Calcular precio_total automáticamente cuando cambia cantidad o precio_unitario
=======
  // Calcular precio_total automáticamente
>>>>>>> main
  useEffect(() => {
    const cantidad = form.values.cantidad;
    const precio_unitario = form.values.precio_unitario;
    const precio_total = cantidad * precio_unitario;
    
    if (!isNaN(precio_total) && isFinite(precio_total)) {
      form.setFieldValue('precio_total', parseFloat(precio_total.toFixed(2)));
    }
  }, [form.values.cantidad, form.values.precio_unitario]);

<<<<<<< HEAD
  const handleSubmit = (values) => {
    onGuardar(values);
=======
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    onGuardar(form.values);
    form.reset();
    setErrores({});
    setTocado({});
>>>>>>> main
  };

  const hayErrores = Object.keys(errores).length > 0;
  const formularioValido = esFormularioValido();

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={isMobile ? "sm" : "md"}>

<<<<<<< HEAD
=======
        {hayErrores && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Errores de validación" 
            color="red" 
            mb="md"
          >
            Por favor corrige los errores en el formulario antes de enviar.
          </Alert>
        )}

>>>>>>> main
        <TextInput
          label="Nombre del proveedor"
          placeholder="Ingresa el nombre del proveedor"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
<<<<<<< HEAD
          {...form.getInputProps('nombre')}
=======
          value={form.values.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          onBlur={(e) => handleBlur('nombre', e.target.value)}
          error={errores.nombre}
>>>>>>> main
        />
        
        <TextInput
          label="Teléfono"
          placeholder="123456789"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
<<<<<<< HEAD
          {...form.getInputProps('telefono')}
=======
          value={form.values.telefono}
          onChange={(e) => handleChange('telefono', e.target.value)}
          onBlur={(e) => handleBlur('telefono', e.target.value)}
          error={errores.telefono}
>>>>>>> main
        />

        <NumberInput
          label="Cantidad"
          placeholder="0"
          min={0}
          size={isMobile ? "sm" : "md"}
<<<<<<< HEAD
          {...form.getInputProps('cantidad')}
=======
          value={form.values.cantidad}
          onChange={(value) => handleChange('cantidad', value)}
          onBlur={() => handleBlur('cantidad', form.values.cantidad)}
          error={errores.cantidad}
>>>>>>> main
        />

        <TextInput
          label="Concepto"
          placeholder="Descripción del producto/servicio"
          size={isMobile ? "sm" : "md"}
          required
          withAsterisk
<<<<<<< HEAD
          {...form.getInputProps('concepto')}
=======
          value={form.values.concepto}
          onChange={(e) => handleChange('concepto', e.target.value)}
          onBlur={(e) => handleBlur('concepto', e.target.value)}
          error={errores.concepto}
>>>>>>> main
        />

        <NumberInput
          label="Precio Unitario"
          placeholder="0.00"
          min={0}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
<<<<<<< HEAD
          rightSection={<Text size="xs" c="dimmed">Bs</Text>}
          {...form.getInputProps('precio_unitario')}
=======
          value={form.values.precio_unitario}
          onChange={(value) => handleChange('precio_unitario', value)}
          onBlur={() => handleBlur('precio_unitario', form.values.precio_unitario)}
          error={errores.precio_unitario}
          rightSection={<Text size="xs" c="dimmed">Bs</Text>}
>>>>>>> main
        />

        <NumberInput
          label="Precio Total"
          placeholder="0.00"
          min={0}
          decimalScale={2}
          size={isMobile ? "sm" : "md"}
<<<<<<< HEAD
          readOnly
          rightSection={<Text size="xs" c="dimmed">Bs</Text>}
          {...form.getInputProps('precio_total')}
=======
          value={form.values.precio_total}
          readOnly
          rightSection={<Text size="xs" c="dimmed">Bs</Text>}
>>>>>>> main
        />

        <Group justify="flex-end" mt="md">
          <Button 
            type="submit" 
            size={isMobile ? "sm" : "md"}
            fullWidth={isMobile}
            disabled={!formularioValido}
            leftSection={!formularioValido ? <IconLock size={16} /> : null}
          >
            {proveedor ? 'Modificar' : 'Agregar'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}