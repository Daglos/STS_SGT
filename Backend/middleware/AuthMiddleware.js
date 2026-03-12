const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

/**
 * Middleware para verificar que el usuario esté autenticado
 * y que el token enviado en headers sea válido.
 */
const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token inválido' });
    }

    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded; // Guardamos info del usuario en req

    // Verificar que el usuario exista y esté activo
    const userDoc = await db.collection('usuarios').doc(decoded.uid).get();
    if (!userDoc.exists || !userDoc.data().estado) {
      return res.status(403).json({ success: false, error: 'Usuario no autorizado o inactivo' });
    }

    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    return res.status(403).json({ success: false, error: 'Token inválido o expirado' });
  }
};

/**
 * Middleware para validar roles de usuario
 * rolesPermitidos: array de nombres de rol (ej: ['admin', 'jefe'])
 */
const verificarRol = (rolesPermitidos = []) => {
  return async (req, res, next) => {
    try {
      const userDoc = await db.collection('usuarios').doc(req.user.uid).get();
      const usuarioData = userDoc.data();

      const rolDoc = await db.collection('roles').doc(usuarioData.idRol).get();
      const rolNombre = rolDoc.exists ? rolDoc.data().rol : null;

      if (!rolesPermitidos.includes(rolNombre)) {
        return res.status(403).json({ success: false, error: 'Acceso denegado: rol no autorizado' });
      }

      next();
    } catch (error) {
      console.error('Error en verificarRol:', error);
      return res.status(500).json({ success: false, error: 'Error verificando rol de usuario' });
    }
  };
};

module.exports = { verificarToken, verificarRol };