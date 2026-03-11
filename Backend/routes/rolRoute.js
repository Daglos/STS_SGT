const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middleware/AuthMiddleware');
const { obtenerRols } = require('../controllers/rolController');

/**
 * Ruta de prueba para verificar que el módulo esté funcionando
 */
router.get('/', (req, res) => {
  res.send('Archivo rol funcionando');
});

/**
 * Obtener todos los roles (solo admins)
 */
router.get('/obtenerRols', verificarToken, verificarRol(['admin']), obtenerRols);

module.exports = router;