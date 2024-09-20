const express = require('express');
const router = express.Router();
const {rempleado, bempleado, dempleado, uempleado} = require("../connections/empleado/empleado");

router.post('/registrar', (req, res) => {
    console.log("Datos entrantes del frontend:", req.body); // Agregar el console.log aquí
    rempleado(req, res, req.app.get('db'));
});


router.post('/actualizar', (req, res) => {
    const idEmpleado = req.body.idEmpleado;
    const datosEmpleado = req.body.datosEmpleado;
    uempleado(req, res, req.app.get('db'), idEmpleado, datosEmpleado);
});

router.post('/eliminar', (req, res) => {
    const idEmpleado = req.body.idEmpleado; 
    dempleado(req, res, req.app.get('db'), idEmpleado); 
});

router.get('/consultar', (req, res) => {
    console.log("Datos entrantes del frontend:", req.body); 
    bempleado(req, res, req.app.get('db'));
});

module.exports = router;
