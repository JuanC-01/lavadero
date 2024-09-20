class Reserva {
    constructor(fecha_reserva, hora_reserva, fk_id_vehiculo, fk_id_empleado) {
        this.fecha_reserva = fecha_reserva;
        this.hora_reserva = hora_reserva;
        this.fk_id_vehiculo = fk_id_vehiculo;
        this.fk_id_empleado = fk_id_empleado;
    }
}

export default Reserva;
