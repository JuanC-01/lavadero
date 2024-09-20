function validation(values, selectedDate, selectedClient, selectedVehiculo, selectedEmplea, selectedTpser ) {
    let errors = {};

    if (!selectedDate) {
        errors.selectedDate = "¡Campo requerido!";
    }
    // cliente
    if (!selectedClient) {
        errors.selectedClient = "¡Campo requerido!";
    }

    if (!selectedVehiculo) {
        errors.selectedVehiculo = "¡Campo requerido!";
    }

     // Validación de la hora de reserva
     if (typeof values.hora_reserva === 'string' && !values.hora_reserva.trim()) {
        errors.hora_reserva = "¡Campo requerido!";
    }

     // Validación del empleado
     if (!selectedEmplea) {
        errors.selectedEmplea = "¡Campo requerido!";
    }
    
    if (!selectedTpser) {
        errors.selectedTpser = "¡Campo requerido!";
    }

    return errors;
}

export default validation;

