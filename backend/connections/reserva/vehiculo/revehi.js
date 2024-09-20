const rvehiculo = (req, res, db) => {
    const { fk_id_cliente, fk_id_catvehi, placa_vehiculo, marca_vehiculo, modelo_vehiculo, anio_vehiculo, estado_vehiculo } = req.body;
    const sqlVPVehi = "SELECT PLACA_VEHICULO FROM VEHICULO WHERE PLACA_VEHICULO = ?";
    db.query(sqlVPVehi, [placa_vehiculo], (err, resultVehi) => {
        if (err) {
            console.error("Error al verificar persona:", err);
            return res.status(500).json({ message: "Error al verificar persona" });
        }
        if (resultVehi.length === 0) {
            const sqlRVehiculo = `CALL REGISTRARVEHICULO(?, ?, ?, ?, ?, ?, ?)`;
            db.query(sqlRVehiculo, [fk_id_cliente, fk_id_catvehi, placa_vehiculo, marca_vehiculo, modelo_vehiculo, anio_vehiculo, estado_vehiculo], (err, result) => {
                if (err) {
                    console.error("Error al registrar vehículo:", err);
                    return res.status(500).json({ message: "Error al registrar vehículo" });
                }
                return res.status(200).json({ message: "Registro vehiculo exitoso" });
            });
        } else {
            return res.status(200).json({ message: "Placa se encuentra Registrada" });
        }
    });
};

const bcliente = (req, res, db) => {
    const searchTerm = req.query.search || ''; // Obtener el término de búsqueda de los parámetros de consulta
    const sql = `CALL CONSULTACLIENTE(?)`; // Usar un parámetro para la búsqueda

    db.query(sql, [searchTerm], (err, result) => {
        if (err) {
            console.error("Error al seleccionar clientes:", err);
            return res.status(500).json({ message: "Error al seleccionar clientes" });
        }
        // Formatear los datos del cliente para incluir más información
        const formattedClients = result[0].map(client => ({
            label: `${client.CC_PERSONA} ${client.NOMBRES_PERSONA} ${client.APELLIDOS_PERSONA}`,
            value: client.ID_CLIENTE, // Utiliza el ID del cliente 
            cc_persona: client.CC_PERSONA, // Incluye el número de identificación 
            nombre: client.NOMBRES_PERSONA, // Incluye el nombre 
            apellido: client.APELLIDOS_PERSONA // Incluye el apellido 
        }));
        return res.status(200).json(formattedClients);
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

const bcatvehiculo = (req, res, db, idTipovehi) => {
    const sql = "CALL CONSULTARCTVEHICULOV(?)";
    db.query(sql, [idTipovehi], (err, result) => {
        if (err) {
            console.error("Error al obtener las categorías de vehículo:", err);
            return res.status(500).json({ message: "Error al obtener las categorías de vehículo" });
        }
        //console.log("Datos de categorías de vehículo obtenidos:", result);
        const formattedCateVehiculo = result[0].map(cateVehiculo => ({
            label: cateVehiculo.NOMBRE_CATVEHICULO,
            value: cateVehiculo.ID_CATVEHICULO
        }));
        //console.log("Categorías vehículo formateados:", formattedCateVehiculo);
        return res.status(200).json(formattedCateVehiculo);
    });
};



module.exports = {
    rvehiculo,
    bcliente,
    btpvehiculo,
    bcatvehiculo,
};


