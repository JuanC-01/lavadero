const rcliente = (req, res, db) => {
    const { cc_persona, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona, correo_persona, direccion_persona } = req.body;
    const sqlVerificarPersona = "SELECT CC_PERSONA FROM PERSONA WHERE CC_PERSONA = ?";
    db.query(sqlVerificarPersona, [cc_persona], (err, resultPersona) => {
        if (err) {
            console.error("Error al verificar persona:", err);
            return res.status(500).json({ message: "Error al verificar persona" });
        }
        if (resultPersona.length === 0) {
            const sqlRPersona = "CALL REGISTRARPERSONA(?, ?, ?, ?, ?, ?, ?)";

            db.query(sqlRPersona, [cc_persona, nombres_persona, apellidos_persona, fechanto_persona, telefono_persona, correo_persona, direccion_persona], (err, result) => {
                if (err) {
                    // Verificar si es menor a 18
                    if (err.code === 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('La persona es menor de 18 años')) {
                        return res.status(200).json({ message: "La persona es menor de 18 años" });
                    }
                    console.error("Error al insertar persona:", err);
                    return res.status(500).json({ message: "Error al insertar persona" });
                }
                const sqlRCliente = "CALL REGISTRARCLIENTE(?)";
                db.query(sqlRCliente, [cc_persona], (err, result) => {
                    if (err) {
                        console.error("Error al registrar cliente:", err);
                        return res.status(500).json({ message: "Error al registrar cliente" });
                    }
                    return res.status(200).json({ message: "Registro cliente exitoso" });
                });
            });
        } else {
            return res.status(200).json({ message: "N° Documento ya se encuentra registrado" });
        }
    });
};

const bclientes = (req, res, db) => {
    const sql = "CALL CONSULTARTCLIENTES()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar clientes:", err);
            return res.status(500).json({ message: "Error al seleccionar clientes" });
        }
        const formattedClientes = result[0].map(cliente => ({
            id: cliente.ID_CLIENTE,
            estado_cliente: cliente.ESTADO_CLIENTE === 'A' ? 'Activo' : 'Inactivo',
            cc_persona: cliente.CC_PERSONA,
            nombres_persona: cliente.NOMBRES_PERSONA,
            apellidos_persona: cliente.APELLIDOS_PERSONA,
            fechanto_persona: cliente.FECHANTO_PERSONA,
            edad_persona: cliente.EDAD_PERSONA,
            telefono_persona: cliente.TELEFONO_PERSONA,
            correo_persona: cliente.CORREO_PERSONA,
            direccion_persona: cliente.DIRECCION_PERSONA,
        }));
        return res.status(200).json(formattedClientes);
    });
};

const bvehicliente = (req, res, db, idClient) => {
    const sql = "CALL CONSULTARVHCLIENTE(?)";
    db.query(sql,  [idClient], (err, result) => {
        if (err) {
            console.error("Error al seleccionar vehiculos cliente:", err);
            return res.status(500).json({ message: "Error al seleccionar vehiculos cliente" });
        }
        //console.log("Datos de vehiculis cliente obtenidos:", result);
        const formattedVClient = result[0].map(vclient => ({
            label: `${vclient.PLACA_VEHICULO} ${vclient.MARCA_VEHICULO}`,
            value: vclient.PLACA_VEHICULO, 
            placa: vclient.PLACA_VEHICULO, 
            marca: vclient.MARCA_VEHICULO, 
        }));
        //console.log("Vehiculos cliente formateados:", formattedVClient);
        return res.status(200).json(formattedVClient);
    });
};

const upcliente = (req, res, db, idCliente, datosCliente) => {
    const { estado_cliente, nombres_persona, apellidos_persona, fechanto_persona,
        telefono_persona, correo_persona, direccion_persona } = datosCliente;
    const estadoCliente = estado_cliente === 'Activo' ? 'A' : 'I';
    const sql = `
        CALL UPDATECLIENTE(
            ${idCliente},
            '${estadoCliente}',
            '${nombres_persona}',
            '${apellidos_persona}',
            '${fechanto_persona}',
            '${telefono_persona}',
            '${correo_persona}',
            '${direccion_persona}'
        )
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al actualizar cliente:", err);
            return res.status(500).json({ message: "Error al actualizar cliente" });
        }
        return res.status(200).json({ message: "Cliente actualizado exitosamente" });
    });
};

const dcliente = (req, res, db, idCliente) => {
    const sql = `CALL ELIMINARCLIENTE(${idCliente})`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al eliminar cliente:", err);
            return res.status(500).json({ message: "Error al eliminar cliente" });
        }
        return res.status(200).json({ message: "Cliente eliminado exitosamente" });
    });
};


module.exports = {
    rcliente,
    bclientes,
    bvehicliente,
    upcliente,
    dcliente,
};
