const express = require('express');
const router = express.Router();
const {rfactura, cdatosfactura, cdatemplea, btpmetodopa, rtpmetodopa, cdfactura} = require("../connections/facturas/factura");

router.post('/registrar-factura', (req, res) => {
    rfactura(req, res, req.app.get('db'));
});

router.post('/registrar-metodopago', (req, res) => {
    rtpmetodopa(req, res, req.app.get('db'));
});

router.get('/buscar-datos/:fecha_reserva/:placa_vehiculo', (req, res) => {
    const { fecha_reserva, placa_vehiculo } = req.params;
    cdatosfactura(req, res, req.app.get('db'), fecha_reserva, placa_vehiculo);
});

router.get('/buscar-empleados/:fechainicio/:fechafin/:valorhora', (req, res) => {
    const { fechainicio, fechafin, valorhora } = req.params;
    cdatemplea(req, res, req.app.get('db'), fechainicio, fechafin, valorhora);
});

router.get('/tp-metodopago', (req, res) => {
    btpmetodopa(req, res, req.app.get('db'));
});

router.get('/buscar-facturas/:fechainicio/:fechafin', (req, res) => {
    const { fechainicio, fechafin} = req.params;
    cdfactura(req, res, req.app.get('db'), fechainicio, fechafin);
});

module.exports = router;
