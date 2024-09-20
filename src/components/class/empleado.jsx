import Persona from './persona';

class Empleado extends Persona {
    constructor(cc_persona, nombre1_persona, nombre2_persona, apellido1_persona, apellido2_persona, fechanto_persona, 
        telefono_persona, correo_persona, direccion_persona, usuario_credenciales, contrasena_credenciales, cargo_empleado) {
        super(cc_persona, nombre1_persona, nombre2_persona, apellido1_persona, apellido2_persona, fechanto_persona, telefono_persona, correo_persona, direccion_persona);
        this.usuario_credenciales = usuario_credenciales;
        this.contrasena_credenciales = contrasena_credenciales;
        this.cargo_empleado = cargo_empleado;
    }
}

export default Empleado;