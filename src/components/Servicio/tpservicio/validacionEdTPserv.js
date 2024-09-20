function validateName(value) {
    if (typeof value === 'string' && value.trim() === '') {
        return "¡Campo requerido!";
    }
    return "";
}


function validation(editedFields) {
    let errors = {};
    

    errors.nombre_tiposer = validateName(editedFields.nombre_tiposer);
    errors.valor_tiposer = validateName(editedFields.valor_tiposer);
    errors.estado_tiposer = validateName(editedFields.estado_tiposer);
    

    return errors;
}

export default validation;
