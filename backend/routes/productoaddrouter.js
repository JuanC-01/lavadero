const express = require('express');
const router = express.Router();
const {rproductoadd, bprodadd, utprodadd} = require("../connections/servicios/serviciosadic/rtprodadd");

router.post('/registro', (req, res) => {
    rproductoadd(req, res, req.app.get('db'));
});


router.post('/actualizar-proadd', (req, res) => {
    const id_productoadd = req.body.id_tiposer;
    const datosPadd = req.body.datosPadd;
    utprodadd(req, res, req.app.get('db'), id_productoadd, datosPadd);
});

router.get('/productos-add', (req, res) => {
    bprodadd(req, res, req.app.get('db'));
});

module.exports = router; 