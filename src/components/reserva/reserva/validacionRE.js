function validation(values, selectedEmplea, selectedTservicio ) {
    let errors = {};

     // Validación del empleado
     if (!selectedEmplea) {
        errors.selectedEmpleaa = "¡Campo requerido!";
    }
    
    if (!selectedTservicio) {
        errors.selectedTservicioo = "¡Campo requerido!";
    }

    return errors;
}

export default validation;





