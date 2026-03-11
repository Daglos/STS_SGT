const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Controlador para autenticar usuarios en el sistema
 * Valida las credenciales del usuario y retorna un token JWT para proteger los endpoints
 */
const iniciarSesion = async (req, res) => {
    try {
        let { correo, contrasena } = req.body || {};

        // Validar campos requeridos
        if (!correo || !contrasena) {
            return res.status(400).json({
                success: false,
                error: "Correo y contraseña son requeridos"
            });
        }

        // Normalizar correo
        correo = correo.toLowerCase().trim();

        // Buscar usuario en la base de datos
        const snapshot = await db.collection('usuarios').where('correo', '==', correo).limit(1).get();
        if (snapshot.empty) {
            return res.status(404).json({ success: false, error: "Credenciales incorrectas" });
        }

        const doc = snapshot.docs[0];
        const usuarioData = doc.data();

        // Comparar contraseña
        const contrasenaMatch = await bcrypt.compare(contrasena, usuarioData.contrasena);
        if (!contrasenaMatch) {
            return res.status(401).json({ success: false, error: "Credenciales incorrectas" });
        }

        // Obtener nombre del rol
        let rolNombre = null;
        const rolDoc = await db.collection('roles').doc(usuarioData.idRol).get();
        if (rolDoc.exists) rolNombre = rolDoc.data().rol;

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: doc.id, 
                correo: usuarioData.correo, 
                idRol: usuarioData.idRol 
            },
            process.env.JWT_SECRET || 'clave_secreta_temporal',
            { expiresIn: '24h' } // Token válido 8 horas
        );

        // Retornar usuario con token
        return res.status(200).json({
            success: true,
            token,
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
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    iniciarSesion
}