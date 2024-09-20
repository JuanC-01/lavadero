const rproductoadd = (req, res, db) => {
    const { nombre_productoadd, precio_productoadd, cantidad_productoadd, descripcion_productoadd } = req.body;

    const sqlRProductoAdd = "CALL REGISTRARPRODUCTOADD(?, ?, ?, ?)";
    db.query(sqlRProductoAdd, [nombre_productoadd, precio_productoadd, cantidad_productoadd, descripcion_productoadd], (err, result) => {
        if (err) {
            console.error("Error al insertar producto adicional:", err);
            return res.status(500).json({ message: "Error al insertar producto adicional" });
        }
        return res.status(200).json({ message: "Registro de producto adicional exitoso" });
    });
};

const bprodadd = (req, res, db) => {
    const sql = "CALL CONSULTARPRODUCTOADD()";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al seleccionar producto adicional:", err);
            return res.status(500).json({ message: "Error al seleccionar  producto adicional" });
        }
        const formattedProdadd = result[0].map(padd => ({
            id: padd.ID_PRODUCTOADD,
            nombre_productoadd: padd.NOMBRE_PRODUCTOADD,
            valor_productoadd: padd.PRECIO_PRODUCTOADD,
            cantidad_productoadd: padd.CANTIDAD_PRODUCTOADD,
            descripcion_productoadd: padd.DESCRIPCION_PRODUCTOADD,
            estado_productoadd: padd.ESTADO_PRODUCTOADD === 'A' ? 'ACTIVO' : 'INACTIVO',
        }));
        console.log(" producto adicional:", formattedProdadd);
        return res.status(200).json(formattedProdadd);
    });
};


const utprodadd = (req, res, db) => {
    const { id_productoadd, datosPadd} = req.body;
    const { nombre_productoadd, valor_productoadd, cantidad_productoadd, descripcion_productoadd, estado_productoadd } = datosPadd;
    
    const estadoPadd = estado_productoadd === 'ACTIVO' ? 'A' : 'I';
    
    const sql = `
        CALL UPDATEPRODUCTOADD(?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
        id_productoadd,
        nombre_productoadd,
        valor_productoadd,
        cantidad_productoadd,
        descripcion_productoadd,
        estadoPadd
    ];
    
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error al actualizar tp servicio:", err);
            return res.status(500).json({ message: "Error al actualizar producto adicional" });
        }
        return res.status(200).json({ message: "producto adicional actualizado exitosamente" });
    });
};


module.exports = {
    rproductoadd,
    bprodadd,
    utprodadd
};