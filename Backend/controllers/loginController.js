// auth.controller.js
const loginService = require('../services/loginService');

/**
 * Controlador para manejar la lógica de inicio de sesión
 * Recibe las credenciales del usuario, llama al servicio de login y retorna la respuesta adecuada
 */
const iniciarSesion = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        //Llamar al servicio de login para validar las credenciales y obtener la información del usuario
        const resultado = await loginService.iniciarSesion(correo, contrasena);

        // Retornar la información del usuario en caso de éxito
        return res.status(200).json({
            success: true,
            usuario: resultado
        });

    } catch (error) {
        // Retornar el Error con el status y mensaje adecuado en caso de fallo
        return res.status(error.status || 500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = { iniciarSesion };