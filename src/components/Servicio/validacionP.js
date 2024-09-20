function validateName(value) {
    if (!value || !value.trim()) {
        return "¡Campo requerido!";
    }
    return "";
}
function validation(values, selectedTvehi ) {
    let errors = {};

    if (!selectedTvehi) {
        errors.selectedTvehi = "¡Campo requerido!";
    }

    errors.nombre_tiposer = validateName(values.nombre_tiposer);
    errors.valor_tiposer = validateName(values.valor_tiposer);
    errors.descripcion_tiposer = validateName(values.descripcion_tiposer);
    errors.nombre_productoadd = validateName(values.nombre_productoadd);
    errors.precio_productoadd = validateName(values.precio_productoadd);
    errors.cantidad_productoadd = validateName(values.cantidad_productoadd);
    errors.descripcion_productoadd = validateName(values.descripcion_productoadd);


    return errors;
}

export default validation;

