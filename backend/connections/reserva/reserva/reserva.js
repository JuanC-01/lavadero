const vdisponibilidad = (req, res, db) => {
    const { fecha_reserva, hora_reserva, fk_id_empleado } = req.body;
    const sqlVDisponibilidad = "CALL VERIFDISPONIBLEEMPL(?, ?, ?, @disponibilidad)";

    db.query(sqlVDisponibilidad, [fk_id_empleado, fecha_reserva, hora_reserva], (err, result) => {
        if (err) {
            console.error("Error al verificar disponibilidad:", err);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
        // Obtener el resultado de la variable de salida del procedimiento almacenado
        db.query('SELECT @disponibilidad AS disponibilidad', (err, result) => {
            if (err) {
                console.error("Error al obtener disponibilidad:", err);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            const disponibilidad = result[0].disponibilidad;
            if (disponibilidad === "Empleado disponible") {
                return res.status(200).json({ disponibilidad, message: "Empleado disponible" });
            } else if (disponibilidad === "No disponible") {
                return res.status(200).json({ message: "Empleado no disponible" });
            } else {
                console.error("Valor de disponibilidad desconocido:", disponibilidad);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    });
};

const rreserva = (req, res, db) => {
    const { fecha_reserva, hora_reserva, fk_id_vehiculo, fk_id_empleado, fk_id_catevehiculo, fk_id_tiposer } = req.body;
    // Primero registrar la reserva
    const sqlInsertarReserva = "CALL REGISTRARRESERVA(?, ?, ?, ?, @id_reserva)";
    db.query(sqlInsertarReserva, [fecha_reserva, hora_reserva, fk_id_vehiculo, fk_id_empleado], (err, resultReserva) => {
        if (err) {
            console.error("Error al registrar reserva:", err);
            return res.status(500).json({ message: "Error al registrar reserva" });
        }
        // Obtener el ID de la nueva reserva
        db.query("SELECT @id_reserva AS id_reserva", (err, rows) => {
            if (err) {
                console.error("Error al obtener el ID de la reserva:", err);
                return res.status(500).json({ message: "Error al obtener el ID de la reserva" });
            }
            const idReserva = rows[0].id_reserva;
            console.log("id reserva", idReserva);
            const sqlInsertarServicio = "CALL REGISTRARCTGTPSERVICIO(?, ?, @id_ctgtpservicio)";
            db.query(sqlInsertarServicio, [fk_id_catevehiculo, fk_id_tiposer], (err, resultServicio) => {
                if (err) {
                    console.error("Error al registrar servicio:", err);
                    return res.status(500).json({ message: "Error al registrar servicio" });
                }
                // Obtener el ID de la nueva asociación
                db.query("SELECT @id_ctgtpservicio AS id_ctgtpservicio", (err, rows) => {
                    if (err) {
                        console.error("Error al obtener el ID del servicio:", err);
                        return res.status(500).json({ message: "Error al obtener el ID del servicio" });
                    }
                    const idCTGTPSERVICIO = rows[0].id_ctgtpservicio;
                    // Finalmente, registrar el servicio
                    const sqlInsertarAsociacion = "CALL REGISTRARSERVICIO(?, ?, ?)";
                    db.query(sqlInsertarAsociacion, ['A', idReserva, idCTGTPSERVICIO], (err, resultAsociacion) => {
                        if (err) {
                            console.error("Error al registrar asociación entre reserva y servicio:", err);
                            return res.status(500).json({ message: "Error al registrar asociación entre reserva y servicio" });
                        }
                        return res.status(200).json({ message: "Registro de reserva exitoso" });
                    });
                });
            });
        });
    });
};


const bcliente = (req, res, db) => {
    const sql = "CALL CONSULTACLIENTE()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar clientes:", err);
            return res.status(500).json({ message: "Error al seleccionar clientes" });
        }
        //console.log("Datos de clientes obtenidos:", result);
        const formattedClients = result[0].map(client => ({
            label: `${client.CC_PERSONA} ${client.NOMBRES_PERSONA} ${client.APELLIDOS_PERSONA}`,
            value: client.ID_CLIENTE,
            cc_persona: client.CC_PERSONA,
            nombre: client.NOMBRES_PERSONA,
            apellido: client.APELLIDOS_PERSONA
        }));
        // console.log("Clientes formateados:", formattedClients);
        return res.status(200).json(formattedClients);
    });
};
const bempleado = (req, res, db) => {
    const sql = "CALL CONSULTAEMPLEADO()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar empleados:", err);
            return res.status(500).json({ message: "Error al seleccionar empleados" });
        }
        //console.log("Datos de empleados obtenidos:", result);       
        const formattedEmplea = result[0].map(emplea => ({
            label: `${emplea.NOMBRES_PERSONA} ${emplea.APELLIDOS_PERSONA}`,
            value: emplea.ID_EMPLEADO,
            cc_persona: emplea.CC_PERSONA,
            nombre: emplea.NOMBRES_PERSONA,
            apellido: emplea.APELLIDOS_PERSONA
        }));
        // console.log("Empleados formateados:", formattedEmplea);
        return res.status(200).json(formattedEmplea);
    });
};

const bclientVehiculo = (req, res, db, cliente_id) => {
    const sql = "CALL CONSULTARCLVEHICULO(?)";
    db.query(sql, [cliente_id], (err, result) => {
        if (err) {
            console.error("Error al seleccionar vehiculos:", err);
            return res.status(500).json({ message: "Error al seleccionar vehiculos" });
        }
        const formattedVehi = result[0].map(vehi => ({
            label: `${vehi.PLACA_VEHICULO} `,
            value: vehi.PLACA_VEHICULO,
            placa: vehi.PLACA_VEHICULO,
            marca: vehi.MARCA_VEHICULO,
            modelo: vehi.MODELO_VEHICULO
        }));
        //console.log("Vehiculos formateados:", formattedVehi);
        return res.status(200).json(formattedVehi);
    });
};


const btpservicio = (req, res, db, placaVehi) => {
    const sql = "CALL CONSULTARTPSERVICIO(?)";
    db.query(sql, [placaVehi], (err, result) => {
        if (err) {
            console.error("Error al obtener tipos de servicios:", err);
            return res.status(500).json({ message: "Error al obtener tipos de servicios" });
        }
        //console.log("Datos de tipos de servicios obtenidos:", result);
        const formattedTServi = result[0].map(tipoServi => ({
            label: `${tipoServi.NOMBRE_TIPOSER} `,
            value: tipoServi.ID_TIPOSER
        }));
        //console.log("Tipos de servicios formateados:", formattedTServi);
        return res.status(200).json(formattedTServi);
    });
};

const bidcatvehiculo = (req, res, db, placaVehi) => {
    const sql = "CALL CONSULTARCTVEHICULO(?)";
    db.query(sql, [placaVehi], (err, result) => {
        if (err) {
            console.error("Error al obtener id de categorías:", err);
            return res.status(500).json({ message: "Error al obtener tipos de servicios" });
        }
        // Verifica si hay resultados y accede correctamente al primer registro
        if (result[0] && result[0][0]) {
            const idCategoriaVehiculo = result[0][0].ID_CATVEHICULO;
            //console.log("ID de la categoría del vehículo:", idCategoriaVehiculo);
            return res.status(200).json({ id_catvehiculo: idCategoriaVehiculo });
        } else {
            console.error("No se encontró la categoría del vehículo");
            return res.status(404).json({ message: "No se encontró la categoría del vehículo" });
        }
    });
};

const cprecioservicio = (req, res, db, fk_id_tipoSer, fk_id_catvehiculo) => {
    const sql = "CALL PRECIOSERVICIO(?, ?)";
    db.query(sql, [fk_id_tipoSer, fk_id_catvehiculo], (err, result) => {
        if (err) {
            console.error("Error al calcular el precio del servicio:", err);
            return res.status(500).json({ message: "Error al calcular el precio del servicio" });
        }
        // Accede al primer conjunto de resultados para obtener el precio
        const precio = result[0][0].precio;
        return res.status(200).json({ precio });
    });
};

const cserfecha = (req, res, db, fecha) => {
    const sql = "CALL CONSULTARSERVICIOSFECHA(?)";
    db.query(sql, [fecha], (err, result) => {
        if (err) {
            console.error("Error al obtener datos del servicio:", err);
            return res.status(500).json({ message: "Error al obtener datos del servicio" });
        }
        //console.log("Resultado de la consulta:", result);
        if (result[0] && result[0].length > 0) {
            const datosServicio = result[0].map((row, index) => ({
                id: index,
                id_servicio: row.ID_SERVICIO,
                id_reserva: row.ID_RESERVA,
                fecha_reserva: row.FECHA_RESERVA,
                hora_reserva: row.HORA_RESERVA,
                estado_reserva: row.ESTADO_RESERVA,
                placaVehi: row.FK_ID_VEHICULO,
                fk_id_catvehiculo: row.fk_id_catvehiculo,
                nombre_catvehiculo: row.NOMBRE_CATVEHICULO,
                empleado_id: row.empleado_id,
                nombre_empleado: row.Nombre_Empleado,
                nombre_cliente: row.Nombre_Cliente,
                fk_id_tipoSer: row.fk_id_tipoSer,
                nombre_tiposer: row.NOMBRE_TIPOSER,
                valor_ctgtpservicio: row.VALOR_CTGTPSERVICIO,
                valor_multa: row.Valor_Multa,
                costo_servproadd: row.costo_servproadd
            }));
            //console.log("Datos del servicio transformados:", datosServicio);
            return res.status(200).json(datosServicio);
        } else {
            console.error("No se encontraron servicios para la fecha proporcionada");
            return res.status(404).json({ message: "No se encontraron servicios para la fecha proporcionada" });
        }
    });
};


const ureserva = (req, res, db) => {
    const { id_servicio, datosReserva } = req.body;
    const { fecha_reserva, hora_reserva, fk_id_empleado, fk_id_tiposer } = datosReserva;

    const sql = `
        CALL UPDATERESERVA(?, ?, ?, ?, ?)
    `;
    const params = [
        id_servicio,
        fecha_reserva,
        hora_reserva,
        fk_id_empleado,
        fk_id_tiposer
    ];
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error al actualizar reserva:", err);
            return res.status(500).json({ message: "Error al actualizar reserva" });
        }
        return res.status(200).json({ message: "Reserva actualizada exitosamente" });
    });
};

const bmotivom = (req, res, db) => {
    const sql = "CALL CONSULTARMOTIVOSM()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar motivos:", err);
            return res.status(500).json({ message: "Error al seleccionar motivos" });
        }
        //console.log("Datos de motivos obtenidos:", result);       
        const formattedMotivosm = result[0].map(motivom => ({
            label: `${motivom.NOMBRE_MOTIVOM} `,
            value: motivom.ID_MOTIVOM,
        }));
        //console.log("motivos formateados:", formattedMotivosm);
        return res.status(200).json(formattedMotivosm);
    });
};

const cpreciomulta = (req, res, db, fk_id_reserva, fk_id_motivom) => {
    const sql = "CALL COSTOMULTA(?, ?)";
    db.query(sql, [fk_id_reserva, fk_id_motivom], (err, result) => {
        if (err) {
            console.error("Error al calcular el precio de la multa:", err);
            return res.status(500).json({ message: "Error al calcular el precio de la multa" });
        }
        const valor_multa = result[0][0].valor_multa;
        return res.status(200).json({ valor_multa });
    });
};

const rmulta = (req, res, db) => {
    const { fk_id_motivom, valor_multa, fk_id_reserva } = req.body;    
    const sqlRVehiculo = `CALL REGISTRARMULTA(?, ?, ?)`;
    db.query(sqlRVehiculo, [fk_id_motivom, valor_multa, fk_id_reserva], (err, result) => {
        if (err) {
            console.error("Error al registrar multa:", err);
            return res.status(500).json({ message: "Error al registrar multa" });
        }
        //console.log("Resultado de la consulta:", result);
        return res.status(200).json({ message: "Registro multa exitosa" });
    });
};

const uestador = (req, res, db) => {
    const { idReserva } = req.params;

    db.query('CALL UPDATEESTADORESERVA(?)', [idReserva], (error, results, fields) => {
        if (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            return res.status(500).json({ message: 'Error al actualizar el estado de la reserva' });
        }
        console.log('Procedimiento almacenado ejecutado correctamente', idReserva);
        return res.status(200).json({ message: 'Estado de reserva actualizado correctamente' });
    });
};

const bprodAdd = (req, res, db) => {
    const sql = "CALL CONSULTARPRODADD()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar productos adicionales:", err);
            return res.status(500).json({ message: "Error al seleccionar productos adicionales" });
        }
        //console.log("Datos de productos adicionales obtenidos:", result);
        const formattedProAdd = result[0].map(proadd => ({
            label: `${proadd.NOMBRE_PRODUCTOADD} - Disponible: ${proadd.CANTIDAD_PRODUCTOADD}`,
            value: proadd.ID_PRODUCTOADD,
            cantidadDisponible: proadd.CANTIDAD_PRODUCTOADD
        }));
        //console.log("productos adicionales formateados:", formattedProAdd);
        return res.status(200).json(formattedProAdd);
    });
};

const cprecioPadd = (req, res, db, fk_id_productoadd, cantidad_servproadd) => {
    const sql = "CALL COSTOPRODADD(?, ?)";
    db.query(sql, [fk_id_productoadd, cantidad_servproadd], (err, result) => {
        if (err) {
            console.error("Error al calcular el precio de prodadd:", err);
            return res.status(500).json({ message: "Error al calcular el precio de prodadd" });
        }
        //console.log('Resultado de la consulta:', result);
        const costo_servproadd = result[0][0].costo_servproadd;
        return res.status(200).json({ costo_servproadd });
    });
};

const rservproadd = (req, res, db) => {
    const { fk_id_servicio, fk_id_producto, cantidad_servproadd, costo_servproadd } = req.body;
    const sqlRProductoAdd = "CALL REGISTRARSERVPROADD(?, ?, ?, ?)";
    db.query(sqlRProductoAdd, [fk_id_servicio, fk_id_producto, cantidad_servproadd, costo_servproadd], (err, result) => {
        if (err) {
            console.error("Error al insertar producto adicional:", err);
            return res.status(500).json({ message: "Error al insertar servproadd" });
        }
        return res.status(200).json({ message: "Registro de servproadd exitoso" });
    });
};

const cservproadd = (req, res, db, id_servicio) => {
    const sql = "CALL CONSULTARPRODUCTOSSERVICIO(?)";
    db.query(sql, [id_servicio], (err, result) => {
        if (result[0] && result[0].length > 0) {
            const datosServicio = result[0].map((row, index) => ({
                id: index,
                idServicio: row.FK_ID_SERVICIO,
                nombre_productoadd: row.NOMBRE_PRODUCTOADD,
                precio_productoadd: row.PRECIO_PRODUCTOADD,
                descripcion_productoadd: row.DESCRIPCION_PRODUCTOADD,
                cantidad_servproadd: row.CANTIDAD_SERVPROADD,
                costo_servproadd: row.COSTO_SERVPROADD
            }));
            console.log("Datos del servicio transformados:", datosServicio);
            return res.status(200).json(datosServicio);
        } else {
            console.error("No se encontraron servicios para la fecha proporcionada");
            return res.status(404).json({ message: "No se encontraron servicios para la fecha proporcionada" });
        }
    });
};

module.exports = {
    vdisponibilidad,
    rreserva,
    bcliente,
    bempleado,
    bclientVehiculo,
    btpservicio,
    bidcatvehiculo,
    cprecioservicio,
    cserfecha,
    ureserva,
    bmotivom,
    cpreciomulta,
    rmulta,
    uestador,
    bprodAdd,
    cprecioPadd,
    rservproadd,
    cservproadd
};
