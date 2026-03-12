/**
 * Middleware para verificar que el usuario tenga un rol permitido
 * @param {Array} rolesPermitidos - lista de roles permitidos para el endpoint
 */
const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      if (!req.usuario || !req.usuario.rol) {
        return res.status(403).json({ success: false, error: 'No se pudo verificar el rol del usuario' })
      }

      if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ success: false, error: 'Acceso denegado: rol no autorizado' })
      }

      next()
    } catch (error) {
      console.error('Error en verificarRol:', error)
      return res.status(500).json({ success: false, error: 'Error interno al verificar rol' })
    }
  }
}

module.exports = { verificarRol }