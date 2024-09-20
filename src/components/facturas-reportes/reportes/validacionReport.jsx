function validateName(value) {
    if (!value || !value.trim()) {
        return "¡Campo requerido!";
    }
    return "";
}
function validation(values, selectedDateIni, selectedDateFin ) {
    let errors = {};

    if (!selectedDateIni) {
        errors.selectedDateIni = "¡Campo requerido!";
    }

    if (!selectedDateFin) {
        errors.selectedDateFin = "¡Campo requerido!";
    }

    errors.tpservi = validateName(values.tpservi);

    return errors;
}

export default validation;

