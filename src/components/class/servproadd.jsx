class servproadd {
    constructor(fk_id_servicio, fk_id_producto, cantidad_servproadd, costo_servproadd) {
        this.fk_id_servicio = fk_id_servicio;
        this.fk_id_producto = fk_id_producto;
        this.cantidad_servproadd = cantidad_servproadd;
        this.costo_servproadd = costo_servproadd;
    }
}

export default servproadd;