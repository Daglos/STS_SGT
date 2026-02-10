const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');

/**
 * Controlador para autenticar usuarios en el sistema
 * Valida las credenciales del usuario contra la base de datos de Firebase
 * y retorna la información del usuario junto con su rol asignado
 */
const iniciarSesion = async (req, res) => {
    try {
        let { correo, contrasena } = req.body || {};

        /**
         * Validar que se proporcionen ambos campos requeridos
         */
        if (!correo || !contrasena) {
            return res.status(400).json({
                success: false,
                error: "Correo y contraseña son requeridos"
            });
        }

        /**
         * Normalizar el correo electrónico a minúsculas y eliminar espacios
         */
        correo = correo.toLowerCase().trim();

        /**
         * Buscar el usuario en la base de datos por correo electrónico
         */
        const snapshot = await db.collection('usuarios').where('correo', '==', correo).limit(1).get();

        /**
         * Verificar si el usuario existe en la base de datos
         */
        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                error: "Credenciales incorrectas"
            });
        }

        const doc = snapshot.docs[0];
        const usuarioData = doc.data();

        /**
         * Comparar la contraseña proporcionada con el hash almacenado en la base de datos
         */
        const contrasenaMatch = await bcrypt.compare(contrasena, usuarioData.contrasena);
        if (!contrasenaMatch) {
            return res.status(401).json({
                success: false,
                error: "Credenciales incorrectas"
            });
        }

        /**
         * Obtener el nombre del rol del usuario desde la colección de roles
         */
        let rolNombre = null;
        const rolDoc = await db.collection('roles').doc(usuarioData.idRol).get();

        if (rolDoc.exists) {
            rolNombre = rolDoc.data().rol;
        }

        /**
         * Retornar la información del usuario autenticado exitosamente
         */
        return res.status(200).json({
            success: true,
            usuario: {
                id: doc.id,
                nombre: usuarioData.nombre,
                apellido: usuarioData.apellido,
                correo: usuarioData.correo,
                estado: usuarioData.estado,
                idRol: usuarioData.idRol,
                rolNombre
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }

}


module.exports = {
    iniciarSesion
}