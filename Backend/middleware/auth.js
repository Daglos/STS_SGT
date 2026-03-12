const { db, admin } = require('../config/firebase')

/**
 * Middleware para verificar token de Firebase en headers
 */
const verificarToken = async (req, res, next) => {
  try {
    // El token debe enviarse en el header Authorization: Bearer <token>
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]

    // Verificar el token usando Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token)

    // Guardar la info del usuario en req
    req.usuario = {
      uid: decodedToken.uid,
      correo: decodedToken.email,
      rol: decodedToken.rol || null // Asegúrar de guardar el rol en token al hacer login
    }

    next()
  } catch (error) {
    console.error('Error en verificarToken:', error)
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' })
  }
}

module.exports = { verificarToken }