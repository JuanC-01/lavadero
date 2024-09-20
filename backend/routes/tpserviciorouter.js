const express = require('express');
const router = express.Router();
const {rtpservicio, btpvehiculo, btipservicios, utpservicio} = require("../connections/servicios/tpservicios/rtpservi");

router.post('/registro', (req, res) => {
    rtpservicio(req, res, req.app.get('db'));
});

router.post('/actualizar-tpserv', (req, res) => {
    const id_tiposer = req.body.id_tiposer;
    const datosTPservicio = req.body.datosTPservicio;
    utpservicio(req, res, req.app.get('db'), id_tiposer, datosTPservicio);
});


router.get('/ctpvehiculo', (req, res) => {
    btpvehiculo(req, res, req.app.get('db'));
});

router.get('/tipos-servicios', (req, res) => {
    btipservicios(req, res, req.app.get('db'));
});


module.exports = router;