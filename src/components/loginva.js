function validation(values) {
    let errors = {};
    const usuario_pattern = /^[a-zA-Z0-9_]{3,15}$/;
    const password_pattern = /^(?=.*\d)[a-zA-Z0-9]{4,15}$/;

    if (!values.usuario_credenciales.trim()) {
        errors.usuario_credenciales = "El usuario no puede estar vacío";
    } else if (!usuario_pattern.test(values.usuario_credenciales)) {
        errors.usuario_credenciales = "Usuario no válido";
    }

    if (!values.contrasena_credenciales.trim()) {
        errors.contrasena_credenciales = "La contraseña no puede estar vacía";
    } else if (!password_pattern.test(values.contrasena_credenciales)) {
        errors.contrasena_credenciales = "La contraseña debe tener al menos 4 caracteres, un numero y sin caracteres especiales";
    }

    return errors;
}

export default validation;
