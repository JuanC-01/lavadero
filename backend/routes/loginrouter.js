const express = require('express');
const router = express.Router();

const logindb = require("../connections/logindb");

router.post('/', (req, res) => {
  //  console.log("Datos entrantes del frontend:", req.body); 
    logindb(req, res, req.app.get('db'));
});

module.exports = router;