class Vehiculo {
    constructor(fk_id_cliente, fk_id_catvehi, placa_vehiculo, marca_vehiculo, modelo_vehiculo, anio_vehiculo, estado_vehiculo) {
        this.fk_id_cliente = fk_id_cliente;
        this.fk_id_catvehi = fk_id_catvehi;
        this.placa_vehiculo = placa_vehiculo;
        this.marca_vehiculo = marca_vehiculo;
        this.modelo_vehiculo = modelo_vehiculo;
        this.anio_vehiculo = anio_vehiculo;
        this.estado_vehiculo = estado_vehiculo;
    }
}

export default Vehiculo;