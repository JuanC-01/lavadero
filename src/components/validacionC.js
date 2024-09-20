function validateName(value) {
    if (!value || !value.trim()) {
        return "¡Campo requerido!";
    }
    return "";
}
function validation(values, selectedVehiculo, selectedTpser, selectedClient, selectedDate, selectedCargo) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const placa_pattern_auto_camioneta = /^[a-zA-Z]{3}\d{3}$/;
    const placa_pattern_motocicleta = /^[a-zA-Z]{3}\d{2}[a-zA-Z]$/;
    const usuario_pattern = /^[a-zA-Z0-9_]{3,15}$/;
    const password_pattern = /^(?=.*\d)[a-zA-Z0-9]{4,15}$/;
    const telefono_pattern = /^\d{10}$/;

    if (values.cargo_empleado !== 'LAVADOR') {
        if (!values.usuario_credenciales || !values.usuario_credenciales.trim()) {
            errors.usuario_credenciales = "¡Campo requerido!";
        } else if (!usuario_pattern.test(values.usuario_credenciales)) {
            errors.usuario_credenciales = "El usuario debe contener mínimo tres(3) caracteres";
        }

        if (!values.contrasena_credenciales || !values.contrasena_credenciales.trim()) {
            errors.contrasena_credenciales = "¡Campo requerido!";
        } else if (!password_pattern.test(values.contrasena_credenciales)) {
            errors.contrasena_credenciales = "La contraseña debe tener al menos 4 caracteres, un numero y sin caracteres especiales";
        }
    }

    if (!values.cc_persona || !values.cc_persona.trim()) {
        errors.cc_persona = "¡Campo requerido!";
    }

    if (!values.correo_persona || !values.correo_persona.trim()) {
        errors.correo_persona = "¡Campo requerido!";
    } else if (!email_pattern.test(values.correo_persona)) {
        errors.correo_persona = "usuario@dominio.com";
    }

    if (selectedVehiculo && selectedVehiculo.value === 2) {
        if (!placa_pattern_motocicleta.test(values.placa_vehiculo)) {
            errors.placa_vehiculo = "El formato de la placa para motocicletas debe ser tres letras seguidas de dos números y una letra opcional (AAA-00A)";
        }
    } else {
        if (!placa_pattern_auto_camioneta.test(values.placa_vehiculo)) {
            errors.placa_vehiculo = "El formato de la placa para automóviles debe ser tres letras seguidas de tres números (AAA-000)";
        }
    }

   

    if (!selectedTpser) {
        errors.selectedTpser = "¡Campo requerido!";
    }


    // Validación del cliente
    if (!selectedClient) {
        errors.selectedClient = "¡Campo requerido!";
    }

   
    // Validación de la fecha 
    if (!selectedDate) {
        errors.selectedDate = "¡Campo requerido!";
    }

  

    if (!values.valor_tiposer || !values.valor_tiposer.trim()) {
        errors.valor_tiposer = "¡Campo requerido!";
    }


    if (!values.telefono_persona || !values.telefono_persona.trim()) {
        errors.telefono_persona = "¡Campo requerido!";
    } else if (!telefono_pattern.test(values.telefono_persona)) {
        errors.telefono_persona = "El número de teléfono debe contener exactamente 10 dígitos";
    }

    if (!selectedCargo) {
        errors.selectedCargo = "¡Campo requerido!";
    }

    errors.nombres_persona = validateName(values.nombres_persona);
    errors.apellidos_persona = validateName(values.apellidos_persona);
    errors.direccion_persona = validateName(values.direccion_persona);
    errors.estado = validateName(values.estado);
    errors.marca_vehiculo = validateName(values.marca_vehiculo);
    errors.modelo_vehiculo = validateName(values.modelo_vehiculo);
    errors.estado_vehiculo = validateName(values.estado_vehiculo);
    errors.nombre_tiposer = validateName(values.nombre_tiposer);

    return errors;
}

export default validation;

