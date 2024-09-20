const express = require('express');
const router = express.Router();

const {rcliente, bclientes, upcliente, dcliente, bvehicliente} = require("../connections/reserva/cliente/cliente");

router.post('/registrar', (req, res) => {
    rcliente(req, res, req.app.get('db'));
});

router.post('/actualizar', (req, res) => {
    const idCliente = req.body.idCliente;
    const datosCliente = req.body.datosCliente;
    upcliente(req, res, req.app.get('db'), idCliente, datosCliente);
});

router.post('/eliminar', (req, res) => {
    const idCliente = req.body.idCliente; 
    dcliente(req, res, req.app.get('db'), idCliente); 
});

router.get('/consultar', (req, res) => {
    bclientes(req, res, req.app.get('db'));
});

router.get('/consulta/:id_client/cvehiculos', (req, res) => {
    const idClient = req.params.id_client;
    console.log("ID del cliente:", idClient); // Agregar este console.log
    bvehicliente(req, res, req.app.get('db'), idClient); 
});


module.exports = router;