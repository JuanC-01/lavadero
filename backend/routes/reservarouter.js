const express = require('express');
const router = express.Router();
const {
    vdisponibilidad, rreserva, bcliente, bempleado, bclientVehiculo, btpservicio, bidcatvehiculo, cprecioservicio,
    cserfecha, ureserva, bmotivom, cpreciomulta, rmulta, uestador, bprodAdd, cprecioPadd, rservproadd, cservproadd
} = require("../connections/reserva/reserva/reserva");

// Rutas POST
router.post('/verificar', (req, res) => {
    vdisponibilidad(req, res, req.app.get('db'));
});

router.post('/registro', (req, res) => {
    rreserva(req, res, req.app.get('db'));
});

router.post('/actualizar', (req, res) => {
    const id_servicio = req.body.id_servicio;
    //console.log("id reserva", id_servicio);
    const datosReserva = req.body.datosEmpleado;
    ureserva(req, res, req.app.get('db'), id_servicio, datosReserva);
});

router.post('/registro-multa', (req, res) => {
    rmulta(req, res, req.app.get('db'));
});

// Rutas GET
router.get('/cliente', (req, res) => {
    const searchTerm = req.query.search || ''; 
    bcliente(req, res, req.app.get('db'), searchTerm); 
});

router.get('/empleado', (req, res) => {
    bempleado(req, res, req.app.get('db'));
});

router.get('/cliente/:id_cliente/vehiculos', (req, res) => {
    const idCliente = req.params.id_cliente;
    bclientVehiculo(req, res, req.app.get('db'), idCliente);
});

router.get('/tpservi/:placa_vehi/consulta', (req, res) => {
    const placaVehi = req.params.placa_vehi;
    btpservicio(req, res, req.app.get('db'), placaVehi);
});

router.get('/id-categoria/:placa_vehiculo', (req, res) => {
    const { placa_vehiculo } = req.params;
    bidcatvehiculo(req, res, req.app.get('db'), placa_vehiculo);
});

router.get('/precio-servicio/:fk_id_tiposer/:fk_id_catvehiculo/consulta', (req, res) => {
    const { fk_id_tiposer, fk_id_catvehiculo } = req.params;
    cprecioservicio(req, res, req.app.get('db'), fk_id_tiposer, fk_id_catvehiculo);
});


router.get('/servicios/:fecha', (req, res) => {
    const { fecha } = req.params;
    //console.log("Fecha recibida del frontend:", fecha);
    cserfecha(req, res, req.app.get('db'), fecha);
});

router.get('/motivom', (req, res) => {
    bmotivom(req, res, req.app.get('db'));
});

router.get('/multa-servicio/:fk_id_reserva/:fk_id_motivom/consulta', (req, res) => {
    const { fk_id_reserva, fk_id_motivom } = req.params;
    cpreciomulta(req, res, req.app.get('db'), fk_id_reserva, fk_id_motivom);
});

//put
router.put('/actualizar-estado/:idReserva', (req, res) => {
    const { idReserva } = req.params;

    uestador(req, res, req.app.get('db'), idReserva);
});

router.get('/producto-adicional', (req, res) => {
    bprodAdd(req, res, req.app.get('db'));
});

router.get('/precio-prodadd/:fk_id_productoadd/:cantidad_servproadd/consulta', (req, res) => {
    const { fk_id_productoadd, cantidad_servproadd } = req.params;
    cprecioPadd(req, res, req.app.get('db'), fk_id_productoadd, cantidad_servproadd);
});

router.post('/registro-servproadd', (req, res) => {
    rservproadd(req, res, req.app.get('db'));
});

router.get('/consulta-servp/:idServicio', (req, res) => {
    const { idServicio } = req.params;
    console.log("id servicio del frontend:", idServicio);
    cservproadd(req, res, req.app.get('db'), idServicio);
});

module.exports = router;
