const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const routes = require("./routes/routers");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "1234",
    database: "demo"
});

db.connect(function (err) {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos con ID ' + db.threadId);
});

// Middleware para pasar la conexión de la base de datos a las rutas
app.use((req, res, next) => {
    req.app.set('db', db);
    next();
});

// Usar las rutas
app.use('/', routes);

app.listen(8081, () => {
    console.log("Escuchando en el puerto 8081");
});


































/*const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const logindb = require("./connections/logindb");
const rempleado = require("./connections/empleado/empleado");
const upemplea = require("./connections/empleado/upempleado");
const consemp = require("./connections/empleado/consempleado");
const rcliente = require("./connections/reserva/Registros/cliente");
const rbcliente = require("./connections/reserva/Registros/clientereserva");
const rbemple =  require("./connections/reserva/Registros/empreserva");
const rreser = require("./connections/reserva/Registros/reserva");
const rvehi = require("./connections/reserva/Registros/revehi");
const rtvehiculo = require("./connections/reserva/Registros/btpvehiculo");
const rTpSer = require("./connections/servicios/Registros/rtpservi");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    port: "3307",
    user: "root",
    password: "",
    database: "demo"
});

db.connect(function (err) {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos con ID ' + db.threadId);
});

//POST
app.post('/login', (req, res) => logindb(req, res, db));
app.post('/rempleado', (req, res) => rempleado(req, res, db));
app.post('/rcliente', (req, res) => rcliente(req, res, db));
app.post('/rreserva/registro', (req, res) => rreser(req, res, db));
app.post('/rvehiculo/registro/ve', (req, res) => rvehi(req, res, db));
app.post('/tpservicio', (req, res) => rTpSer(req, res, db));
app.post('/rreserva/registro', (req, res) => {
    console.log("Datos recibidos del frontend:", req.body);
    upemplea(req, res, db); 
});

/*
app.post('/rreserva/registro', (req, res) => {
    console.log("Datos recibidos del frontend:", req.body);
    rreser(req, res, db); 
});*/

/*
//GET
app.get('/cempleado', (req, res) => consemp(req, res, db)); 
app.get('/rreserva/cliente', (req, res) => rbcliente(req, res, db)); 
app.get('/rreserva/empleado', (req, res) => rbemple(req, res, db));
app.get('/rvehiculo/tvehiculo', (req, res) => rtvehiculo(req, res, db)); 


app.listen(8081, () => {
    console.log("escuchando");
});
*/