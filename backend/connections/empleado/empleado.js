const rempleado = (req, res, db) => {
    const { cc_persona, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona, correo_persona, direccion_persona,
        usuario_credenciales, contrasena_credenciales, cargo_empleado } = req.body;
    const estadoCredenciales = cargo_empleado === 'LAVADOR' ? 'I' : 'A';
    
    if (cargo_empleado !== 'LAVADOR' && (!usuario_credenciales || !contrasena_credenciales || !cargo_empleado)) {
        return res.status(400).json({ message: "Datos del empleado incompletos" });
    }
    const sqlVPersona = "SELECT CC_PERSONA FROM PERSONA WHERE CC_PERSONA = ?";
    db.query(sqlVPersona, [cc_persona], (err, resultPersona) => {
        if (err) {
            console.error("Error al verificar persona:", err);
            return res.status(500).json({ message: "Error al verificar persona" });
        }
        if (resultPersona.length === 0) {
            const sqlRPersona = "CALL REGISTRARPERSONA(?, ?, ?, ?, ?, ?, ?)";
            db.query(sqlRPersona, [cc_persona, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona, correo_persona, direccion_persona], (err, resultRegistrarPersona) => {
                if (err) {
                    // Verificar si es menor a 18
                    if (err.code === 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('La persona es menor de 18 años')) {
                        return res.status(200).json({ message: "La persona es menor de 18 años" });
                    }
                    console.error("Error al insertar persona:", err);
                    return res.status(500).json({ message: "Error al insertar persona" });
                }
                const sqlREmpleado = "CALL REGISTRAREMPLEADO(?, ?, ?, ?, ?, ?)";
                db.query(sqlREmpleado, [cc_persona, usuario_credenciales, contrasena_credenciales, estadoCredenciales, cargo_empleado, 'A'], (err, resultRegistrarEmpleado) => {
                    if (err) {
                        console.error("Error al registrar empleado:", err);
                        return res.status(500).json({ message: "Error al registrar empleado" });
                    }
                    return res.status(200).json({ message: "Registro empleado exitoso" });
                });
            });
        } else {
            return res.status(200).json({ message: "N° Documento ya se encuentra registrado" });
        }
    });
};


const bempleado = (req, res, db) => {
    const sql = "CALL CONSULTARTEMPLEADOS()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar empleados:", err);
            return res.status(500).json({ message: "Error al seleccionar empleados" });
        }
        const formattedEmpleados = result[0].map(emplea => ({
            id: emplea.ID_EMPLEADO,
            estado_empleado: emplea.ESTADO_EMPLEADO === 'A' ? 'Activo' : 'Inactivo',
            cc_persona: emplea.CC_PERSONA,
            nombres_persona: emplea.NOMBRES_PERSONA,
            apellidos_persona: emplea.APELLIDOS_PERSONA,
            fechanto_persona: emplea.FECHANTO_PERSONA,
            edad_persona: emplea.EDAD_PERSONA,
            telefono_persona: emplea.TELEFONO_PERSONA,
            correo_persona: emplea.CORREO_PERSONA,
            direccion_persona: emplea.DIRECCION_PERSONA,
            usuario_credenciales: emplea.USUARIO_CREDENCIALES,
            contrasena_credenciales: emplea.CONTRASENA_CREDENCIALES,
            cargo_empleado: emplea.CARGO_EMPLEADO
        }));
        return res.status(200).json(formattedEmpleados);
    });
};
const uempleado = (req, res, db) => {
    const { idEmpleado, datosEmpleado } = req.body;
    const { estado_empleado, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona, 
        correo_persona, direccion_persona, usuario_credenciales, contrasena_credenciales, cargo_empleado } = datosEmpleado;
    
    const estadoEmpleado = estado_empleado === 'Activo' ? 'A' : 'I';
    
    const sql = `
        CALL UPDATEEMPLEADO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
        idEmpleado,
        estadoEmpleado,
        nombres_persona,
        apellidos_persona,
        fechanto_persona,
        telefono_persona,
        correo_persona,
        direccion_persona,
        usuario_credenciales,
        contrasena_credenciales,
        cargo_empleado
    ];
    
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error al actualizar empleado:", err);
            return res.status(500).json({ message: "Error al actualizar empleado" });
        }
        return res.status(200).json({ message: "Empleado actualizado exitosamente" });
    });
};



const dempleado = (req, res, db, idEmpleado) => {
    const sql = `CALL ELIMINAREMPLEADO(${idEmpleado})`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al eliminar empleado:", err);
            return res.status(500).json({ message: "Error al eliminar empleado" });
        }

        return res.status(200).json({ message: "Empleado eliminado exitosamente" });
    });
};

module.exports = {
    rempleado,
    bempleado,
    uempleado,
    dempleado,
};



/*
const rempleado = (req, res, db) => {
    const { cc_persona, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona, correo_persona, direccion_persona,
        usuario_credenciales, contrasena_credenciales, cargo_empleado } = req.body;
    const estadoCredenciales = cargo_empleado === 'LAVADOR' ? 'I' : 'A';
    
    if (cargo_empleado !== 'LAVADOR' && (!usuario_credenciales || !contrasena_credenciales || !cargo_empleado)) {
        return res.status(400).json({ message: "Datos del empleado incompletos" });
    }
    // Verificar si la persona ya existe
    const sqlVerificarPersona = "SELECT CC_PERSONA FROM PERSONA WHERE CC_PERSONA = ?";
    db.query(sqlVerificarPersona, [cc_persona], (err, resultPersona) => {
        if (err) {
            console.error("Error al verificar persona:", err);
            return res.status(500).json({ message: "Error al verificar persona" });
        }
        // Si la persona no existe, registrarla y luego al empleado
        if (resultPersona.length === 0) {
            bcrypt.hash(contrasena_credenciales, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error("Error al aplicar hash a la contraseña:", hashErr);
                    return res.status(500).json({ message: "Error al aplicar hash a la contraseña" });
                }
                const sqlInsertarPersona = "CALL InsertarPersona(?, ?, ?, ?, ?, ?, ?)";
                db.query(sqlInsertarPersona, [cc_persona, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona, correo_persona, direccion_persona], (err, resultInsertarPersona) => {
                    if (err) {
                        console.error("Error al insertar persona:", err);
                        return res.status(500).json({ message: "Error al insertar persona" });
                    }
                    const sqlRegistrarEmpleado = "CALL RegistrarEmpleado(?, ?, ?, ?, ?, ?)";
                    db.query(sqlRegistrarEmpleado, [cc_persona, usuario_credenciales, hashedPassword, estadoCredenciales, cargo_empleado, 'A'], (err, resultRegistrarEmpleado) => {
                        if (err) {
                            console.error("Error al registrar empleado:", err);
                            return res.status(500).json({ message: "Error al registrar empleado" });
                        }
                        return res.status(200).json({ message: "Registro empleado exitoso" });
                    });
                });
            });
        } else {
            return res.status(200).json({ message: "La persona ya está registrada" });
        }
    });
};




const uempleado = (req, res, db, idEmpleado, datosEmpleado) => {
    const { estado_empleado, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona,
        correo_persona, direccion_persona, usuario_credenciales, contrasena_credenciales, cargo_empleado } = datosEmpleado;
    const estadoEmpleado = estado_empleado === 'Activo' ? 'A' : 'I';

    // Verificar si se proporcionó una nueva contraseña
    if (contrasena_credenciales) {
        // Aplicar hash a la nueva contraseña
        bcrypt.hash(contrasena_credenciales, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error("Error al aplicar hash a la nueva contraseña:", hashErr);
                return res.status(500).json({ message: "Error al aplicar hash a la nueva contraseña" });
            }
            // Actualizar empleado con la nueva contraseña hash
            const sql = `
                CALL actualizarEmpleado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(sql, [idEmpleado, estadoEmpleado, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona,
                correo_persona, direccion_persona, usuario_credenciales, hashedPassword, cargo_empleado], (err, result) => {
                if (err) {
                    console.error("Error al actualizar empleado:", err);
                    return res.status(500).json({ message: "Error al actualizar empleado" });
                }
                return res.status(200).json({ message: "Empleado actualizado exitosamente" });
            });
        });
    } else {
        // Si no se proporcionó una nueva contraseña, actualizar empleado sin modificar la contraseña
        const sql = `
            CALL actualizarEmpleado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [idEmpleado, estadoEmpleado, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona,
            correo_persona, direccion_persona, usuario_credenciales, contrasena_credenciales, cargo_empleado], (err, result) => {
            if (err) {
                console.error("Error al actualizar empleado:", err);
                return res.status(500).json({ message: "Error al actualizar empleado" });
            }
            return res.status(200).json({ message: "Empleado actualizado exitosamente" });
        });
    }
};

*/