const rtpservicio = (req, res, db) => {
    const { nombre_tiposer, valor_tiposer, estado_tiposer, descripcion_tiposer } = req.body;

    const sqlRTPServicio = "CALL REGISTRARTPSERVICIO(?, ?, ?, ?)";
    db.query(sqlRTPServicio, [nombre_tiposer, valor_tiposer, estado_tiposer, descripcion_tiposer], (err, result) => {
        if (err) {
            console.error("Error al insertar tipo de servicio:", err);
            return res.status(500).json({ message: "Error al insertar tipo de servicio" });
        }
        return res.status(200).json({ message: "Registro tpservico exitoso" });
    });
};

const btpvehiculo = (req, res, db) => {
    const sql = "CALL CONSULTATPVEHICULO()"; 
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener tipos de vehículo:", err);
            return res.status(500).json({ message: "Error al obtener tipos de vehículo" });
        }
        //console.log("Datos de tipos de vehículo obtenidos:", result);
        const formattedTipoVehiculo = result[0].map(tipoVehiculo => ({
            label: tipoVehiculo.NOMBRE_TIPOVEHI,
            value: tipoVehiculo.ID_TIPOVEHI
        }));
        //console.log("Tipos de vehículo formateados:", formattedTipoVehiculo);
        return res.status(200).json(formattedTipoVehiculo);
    });
};

const btipservicios = (req, res, db) => {
    const sql = "CALL CONSULTAR_TIPOSERVICIOS()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar empleados:", err);
            return res.status(500).json({ message: "Error al seleccionar empleados" });
        }
        const formattedTiposServ = result[0].map(tpser => ({
            id: tpser.ID_TIPOSER,
            nombre_tiposer: tpser.NOMBRE_TIPOSER,
            valor_tiposer: tpser.VALOR_TIPOSER,
            estado_tiposer: tpser.ESTADO_TIPOSER === 'V' ? 'AUTOMOVIL' : 'MOTOCICLCETA',
            descripcion_tiposer: tpser.DESCRIPCION_TIPOSER
        }));
        //console.log("Tipos de servicios:", formattedTiposServ);
        return res.status(200).json(formattedTiposServ);
    });
};


const utpservicio = (req, res, db) => {
    const { id_tiposer, datosTPservicio} = req.body;
    const { nombre_tiposer, valor_tiposer, estado_tiposer, descripcion_tiposer } = datosTPservicio;
    
    const estadoTPservicio = estado_tiposer === 'AUTOMOVIL' ? 'V' : 'M';
    
    const sql = `
        CALL UPDATETIPOSERVICIO(?, ?, ?, ?, ?)
    `;
    
    const params = [
        id_tiposer,
        nombre_tiposer,
        valor_tiposer,
        estadoTPservicio,
        descripcion_tiposer
    ];
    
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error al actualizar tp servicio:", err);
            return res.status(500).json({ message: "Error al actualizar tp servicio" });
        }
        return res.status(200).json({ message: "TP servicio actualizado exitosamente" });
    });
};


module.exports = {
    rtpservicio,
    btpvehiculo,
    btipservicios,
    utpservicio
};

