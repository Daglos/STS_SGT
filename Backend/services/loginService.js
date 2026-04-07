const loginRepository = require('../repositories/loginRepository');
const bcrypt = require('bcrypt');

/**
 * Servicio para iniciar sesión en el sistema
 * Valida las credenciales del usuario y retorna información de sesión
 */
const iniciarSesion = async (correo, contrasena) => {

    /**
     * Validación básica de entrada: verificar que correo y contraseña no estén vacíos
     */
    if (!correo || !contrasena) {
        throw { status: 400, message: "Correo y contraseña son requeridos" };
    }

    // Normalizar el correo
    const correoNormalizado = correo.toLowerCase().trim();

    // Validar que el usuario exista
    const usuario = await loginRepository.obtenerPorCorreo(correoNormalizado);

    if (!usuario) {
        throw { status: 404, message: "Credenciales incorrectas" };
    }

    // Validar la contraseña utilizando bcrypt
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) {
        throw { status: 401, message: "Credenciales incorrectas" };
    }

    // Verificar que el usuario esté activo
    if (usuario.estado !== "activo") {
        throw { status: 403, message: "Usuario inactivo" };
    }

    // Retornar información relevante del usuario para la sesión
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        idRol: usuario.idRol
    };
};

module.exports = { iniciarSesion };