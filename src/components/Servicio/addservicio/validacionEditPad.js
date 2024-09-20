function validateName(value) {
    if (typeof value === 'string' && value.trim() === '') {
        return "¡Campo requerido!";
    }
    return "";
}


function validation(editedFields) {
    let errors = {};
    

    errors.nombre_productoadd = validateName(editedFields.nombre_productoadd);
    errors.valor_productoadd = validateName(editedFields.valor_productoadd);
    errors.estado_tiposer = validateName(editedFields.estado_tiposer);
    

    return errors;
}

export default validation;
