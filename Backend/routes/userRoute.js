const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middleware/AuthMiddleware');

const {
  obtenerUser, crearUser, actualizarUser, actualizarState,
  solicitarCambioContrasena, cambiarContrasena
} = require('../controllers/userController');

// Solo usuarios autenticados pueden ver la lista de usuarios
router.get('/obtenerUsers', verificarToken, verificarRol(['admin']), obtenerUser);

// Crear usuario solo por admins
router.post('/crearUsers', verificarToken, verificarRol(['admin']), crearUser);

// Actualizar usuario
router.put('/actualizarUsers', verificarToken, verificarRol(['admin']), actualizarUser);

// Cambiar estado de usuario
router.put('/actualizarState', verificarToken, verificarRol(['admin']), actualizarState);

// Solicitar cambio de contraseña no requiere token
router.post('/solicitarCambioContrasena', solicitarCambioContrasena);
router.put('/cambiarContrasena', cambiarContrasena);

module.exports = router;