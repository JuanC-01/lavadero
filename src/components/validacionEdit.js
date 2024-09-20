function validateName(value) {
    if (!value || !value.trim()) {
        return "¡Campo requerido!";
    }
    return "";
}

function validation(editedFields) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usuario_pattern = /^[a-zA-Z0-9_]{3,15}$/;
    const password_pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{4,}$/;
    const telefono_pattern = /^\d{10}$/;

    if (!editedFields.correo_persona || !editedFields.correo_persona.trim()) {
        errors.correo_persona = "¡Campo requerido!";
    } else if (!email_pattern.test(editedFields.correo_persona)) {
        errors.correo_persona = "usuario@dominio.com";
    }

    if (editedFields.cargo_empleado !== 'LAVADOR') {
        if (!editedFields.usuario_credenciales || !editedFields.usuario_credenciales.trim()) {
            errors.usuario_credenciales = "¡Campo requerido!";
        } else if (!usuario_pattern.test(editedFields.usuario_credenciales)) {
            errors.usuario_credenciales = "El usuario debe contener mínimo tres(3) caracteres";
        }

        if (!editedFields.contrasena_credenciales || !editedFields.contrasena_credenciales.trim()) {
            errors.contrasena_credenciales = "¡Campo requerido!";
        } else if (!password_pattern.test(editedFields.contrasena_credenciales)) {
            errors.contrasena_credenciales = "La contraseña debe tener al menos 4 caracteres, un numero y un carácter especial.";
        }
    }
    if (!editedFields.telefono_persona || !editedFields.telefono_persona.trim()) {
        errors.telefono_persona = "¡Campo requerido!";
    } else if (!telefono_pattern.test(editedFields.telefono_persona)) {
        errors.telefono_persona = "El número de teléfono debe contener exactamente 10 dígitos";
    }


    errors.nombres_persona = validateName(editedFields.nombres_persona);
    errors.apellidos_persona = validateName(editedFields.apellidos_persona);
    errors.direccion_persona = validateName(editedFields.direccion_persona);
    

    return errors;
}

export default validation;
