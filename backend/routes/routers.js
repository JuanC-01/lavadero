const express = require('express');
const router = express.Router();

const loginrouter = require('../routes/loginrouter');
const reservaRouter = require('../routes/reservarouter');
const empleadoRouter = require('../routes/empleadorouter'); 
const clienterouter = require('../routes/clienterouter');
const vehiculorouter = require('../routes/vehiculorouter');
const tpserviciorouter = require('../routes/tpserviciorouter');
const productoaddrouter = require('../routes/productoaddrouter');
const facturarouter = require('../routes/facturarouter');

router.use('/login', loginrouter);
router.use('/rreserva', reservaRouter);
router.use('/rempleado', empleadoRouter);
router.use('/rcliente', clienterouter);
router.use('/rvehiculo', vehiculorouter);
router.use('/tpservicio', tpserviciorouter);
router.use('/productoadd', productoaddrouter);
router.use('/factura', facturarouter);


module.exports = router;
