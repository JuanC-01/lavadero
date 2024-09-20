function validateName(value) {
    if (!value || !value.trim()) {
        return "¡Campo requerido!";
    }
    return "";
}
function validation(values, selectedClient, selectedTvehi, selectedCvehi ) {
    let errors = {};
    const placa_pattern_auto_camioneta = /^[a-zA-Z]{3}\d{3}$/;
    const placa_pattern_motocicleta = /^[a-zA-Z]{3}\d{2}[a-zA-Z]$/;


    // cliente
    if (!selectedClient) {
        errors.selectedClient = "¡Campo requerido!";
    }

    //Tp Vehiculo
    if (!selectedTvehi) {
        errors.selectedTvehi = "¡Campo requerido!";
    }

    //Categoria Vehiculo
    if (!selectedCvehi) {
        errors.selectedCvehi = "¡Campo requerido!";
    }

    if (selectedTvehi && selectedTvehi.value === 2) {
        if (!placa_pattern_motocicleta.test(values.placa_vehiculo)) {
            errors.placa_vehiculo = "El formato de la placa para motocicletas debe ser tres letras seguidas de dos números y una letra opcional (AAA-00A)";
        }
    } else {
        if (!placa_pattern_auto_camioneta.test(values.placa_vehiculo)) {
            errors.placa_vehiculo = "El formato de la placa para automóviles debe ser tres letras seguidas de tres números (AAA-000)";
        }
    }

    errors.marca_vehiculo = validateName(values.marca_vehiculo);
    errors.modelo_vehiculo = validateName(values.modelo_vehiculo);


    return errors;
}

export default validation;

