const express = require('express');
const router = express.Router();
const {rvehiculo, bcliente, btpvehiculo, bcatvehiculo} = require("../connections/reserva/vehiculo/revehi");

router.post('/registrar', (req, res) => {
    rvehiculo(req, res, req.app.get('db'));
});

router.get('/cliente', (req, res) => {
    const searchTerm = req.query.search || ''; 
    bcliente(req, res, req.app.get('db'), searchTerm); 
});


router.get('/ctpvehiculo', (req, res) => {
    btpvehiculo(req, res, req.app.get('db'));
});

router.get('/catvehiculo/:id_tipovehi/tvehiculo', (req, res) => {
    const idTipovehi = req.params.id_tipovehi;
    bcatvehiculo(req, res, req.app.get('db'), idTipovehi); 
});



module.exports = router;
