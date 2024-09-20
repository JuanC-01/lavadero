const rfactura = (req, res, db) => {
    const { fk_id_servicio } = req.body;
    const sqlRFactura = "CALL REGISTRARFACTURASERVICIO(?)";
    db.query(sqlRFactura, [fk_id_servicio], (err, result) => {
        if (err) {
            console.error("Error al insertar factura:", err);
            return res.status(500).json({ message: "Error al insertar en facturaservicio" });
        }
        return res.status(200).json({ message: "Registro facturaservicio exitoso" });
    });
};

const cdatosfactura = (req, res, db, fecha_reserva, placa_vehiculo) => {
    const sql = "CALL CONSULTARFACTURA(?, ?)";
    db.query(sql, [fecha_reserva, placa_vehiculo], (err, result) => {
        if (err) {
            console.error('Error ejecutando el procedimiento almacenado:', err);
            return res.status(500).json({ message: "Error al obtener datos" });
        }
        if (result[0] && result[0].length > 0) {
            // Procesar datos para agrupar productos adicionales
            const servicios = [];
            const productosAdicionales = {};
            result[0].forEach((item) => {
                if (!servicios.some(servicio => servicio.NOMBRE_TIPOSERVICIO === item.NOMBRE_TIPOSERVICIO)) {
                    servicios.push({
                        NOMBRE_TIPOSERVICIO: item.NOMBRE_TIPOSERVICIO,
                        VALOR_SERVICIO: item.VALOR_SERVICIO
                    });
                }
                if (item.NOMBRE_PRODUCTOADD) {
                    if (!productosAdicionales[item.NOMBRE_PRODUCTOADD]) {
                        productosAdicionales[item.NOMBRE_PRODUCTOADD] = {
                            PRECIO_PRODUCTOADD: item.PRECIO_PRODUCTOADD,
                            CANTIDAD_SERVPROADD: item.CANTIDAD_SERVPROADD,
                            COSTO_SERVPROADD: item.COSTO_SERVPROADD
                        };
                    } else {
                        productosAdicionales[item.NOMBRE_PRODUCTOADD].CANTIDAD_SERVPROADD += item.CANTIDAD_SERVPROADD;
                        productosAdicionales[item.NOMBRE_PRODUCTOADD].COSTO_SERVPROADD += item.COSTO_SERVPROADD;
                    }
                }
            });
            const datosFactura = {
                idFactura: result[0][0].ID_FACTURASER,
                cliente: {
                    NOMBRES_CLIENTE: result[0][0].NOMBRES_CLIENTE,
                    APELLIDOS_CLIENTE: result[0][0].APELLIDOS_CLIENTE,
                    PLACA_VEHICULO: result[0][0].PLACA_VEHICULO,
                    NOMBRE_TIPOVEHI: result[0][0].NOMBRE_TIPOVEHI,
                    NOMBRE_CATVEHICULO: result[0][0].NOMBRE_CATVEHICULO,
                    NOMBRES_EMPLEADO: result[0][0].NOMBRES_EMPLEADO,
                    APELLIDOS_EMPLEADO: result[0][0].APELLIDOS_EMPLEADO
                },
                servicios,
                productosAdicionales: Object.keys(productosAdicionales).map(key => ({
                    NOMBRE_PRODUCTOADD: key,
                    ...productosAdicionales[key]
                })),
                totalFactura: result[0][0].TOTAL_FACTURA 
            };
            //console.log("Datos de factura:", datosFactura);
            return res.status(200).json(datosFactura);
        } else {
            console.error("No se encontraron datos en la fecha proporcionada");
            return res.status(404).json({ message: "No se encontraron datos" });
        }
    });
};


const cdatemplea = (req, res, db, fechainicio, fechafin, valorhora) => {
    const sql = "CALL CONSULTARVALARSEMANAEMPLEADOS(?, ?, ?)";
    db.query(sql, [fechainicio, fechafin, valorhora], (err, result) => {
        if (err) {
            console.error('Error ejecutando el procedimiento almacenado:', err);
            return res.status(500).json({ message: "Error al obtener datos" });
        }
        if (result[0] && result[0].length > 0) {
            const datosEmpleados = {
                reserva: result[0].map(item => ({
                    Cantidad_Reservas: item.Cantidad_Reservas,
                    Nombres_Empleado: item.Nombres_Empleado,
                    Apellidos_Empleado: item.Apellidos_Empleado,
                    Valor_Semanal: item.Valor_Semanal
                })),
            };

            console.log("Datos de empleados:", datosEmpleados);
            return res.status(200).json(datosEmpleados);
        } else {
            console.error("No se encontraron datos empleados");
            return res.status(404).json({ message: "No se encontraron datos" });
        }
    });
};

const btpmetodopa = (req, res, db) => {
    const sql = "CALL CONSULTARTIPOMETODPA()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar metodo pago :", err);
            return res.status(500).json({ message: "Error al seleccionar metodo pago " });
        }
        console.log("Datos de metodo pago  obtenidos:", result);
        const formattedMetop = result[0].map(metop => ({
            label: `${metop.NOMBRE_TIPOMETODOPAGO} `,
            value: metop.ID_TIPOMETODOPAGO
        }));
        console.log("metodo pago formateados:", formattedMetop);
        return res.status(200).json(formattedMetop);
    });
};

const rtpmetodopa = (req, res, db) => {
    const { fk_id_tipometodopago, fk_id_facturaser} = req.body;
    const sqlRMetodopa = "CALL RegistrarMetodoPago(?, ?)";
    db.query(sqlRMetodopa, [fk_id_tipometodopago, fk_id_facturaser ], (err, result) => {
        if (err) {
            console.error("Error al insertar metodopago:", err);
            return res.status(500).json({ message: "Error al insertar en metodopago" });
        }
        return res.status(200).json({ message: "Registro metodopago exitoso" });
    });
};

const cdfactura = (req, res, db, fecha_inicio, fecha_fin) => {
    const sql = "CALL CONSULTAFACTURASPORFECHA(?, ?)";
    db.query(sql, [fecha_inicio, fecha_fin], (err, results) => {
        if (err) {
            console.error('Error ejecutando el procedimiento almacenado:', err);
            return res.status(500).json({ message: "Error al obtener datos" });
        }
        
        if (results && results.length > 0) {
            // Procesar datos para agrupar productos adicionales
            const facturasPagadas = results[0].map(factura => ({
                ...factura,
                NOMBRE_TIPOMETODOPAGO: factura.NOMBRE_TIPOMETODOPAGO ? factura.NOMBRE_TIPOMETODOPAGO : "Sin método de pago"
            }));
            const facturasNoPagadas = results[1];
            
            const response = {
                facturasPagadas: facturasPagadas,
                facturasNoPagadas: facturasNoPagadas
            };
            
            return res.status(200).json(response);
        } else {
            console.error("No se encontraron datos en el rango de fechas proporcionado");
            return res.status(404).json({ message: "No se encontraron datos" });
        }
    });
};




module.exports = {
    rfactura,
    cdatosfactura,
    cdatemplea,
    btpmetodopa,
    rtpmetodopa,
    cdfactura
};
