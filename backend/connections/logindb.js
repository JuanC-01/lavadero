const jwt = require('jsonwebtoken');

const logindb = (req, res, db) => {
    // Llama al procedimiento almacenado
    const sql = "CALL LOGIN(?, ?)";
    db.query(sql, [req.body.usuario_credenciales, req.body.contrasena_credenciales], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        
        if (data.length > 0) {
            if (data[0][0].mensaje === "Credenciales no activas") {
                return res.status(200).json({ message: "Credenciales no activas" });
            } else {
                const token = jwt.sign({ userId: data[0][0].userId }, 'secreto', { expiresIn: '1h' });
                return res.status(200).json({ message: "Inicio Exitoso", token });
            }
        } else {
            return res.status(200).json({ message: "Usuario o Contraseña Incorrectos" });
        }
    });
};

module.exports = logindb;


/*const bcrypt = require('bcrypt');

const logindb = (req, res, db) => {
    const { usuario_credenciales, contrasena_credenciales } = req.body;

    console.log("Datos de inicio de sesión recibidos:", { usuario_credenciales, contrasena_credenciales }); // Registra los datos recibidos del frontend

    // Consulta SQL para obtener el hash de la contraseña almacenada
    const sql = "SELECT contrasena_credenciales FROM credenciales WHERE usuario_credenciales = ?";
    db.query(sql, [usuario_credenciales], (err, data) => {
        if (err) {
            console.error("Error al buscar usuario en la base de datos:", err);
            return res.status(500).json({ message: "Error interno del servidor" });
        }

        if (data.length > 0) {
            const hashedPassword = data[0].contrasena_credenciales;
            console.log("Contraseña almacenada en la base de datos:", hashedPassword); // Registra la contraseña almacenada en la base de datos

            // Comparar la contraseña proporcionada con el hash almacenado usando bcrypt
            bcrypt.compare(contrasena_credenciales, hashedPassword, (bcryptErr, result) => {
                if (bcryptErr) {
                    console.error("Error al comparar contraseñas:", bcryptErr);
                    return res.status(500).json({ message: "Error interno del servidor" });
                }

                console.log("contraseñas a comparar:", contrasena_credenciales);
                console.log("Comparación de contraseñas:", result); // Registra el resultado de la comparación de contraseñas

                if (result) {
                    return res.json("Éxito"); // Contraseña válida
                } else {
                    return res.json("Fallo"); // Contraseña incorrecta
                }
            });
        } else {
            console.log("Usuario no encontrado en la base de datos:", usuario_credenciales); // Registra el usuario no encontrado en la base de datos
            return res.json("Fallo"); // Usuario no encontrado
        }
    });
};

module.exports = logindb;

*/



