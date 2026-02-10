const express = require('express')
const router = express.Router()

const {obtenerRols} = require('../controllers/rolController')

/**
 * Ruta de prueba para verificar que el módulo esté funcionando
 */
router.get('/', (req, res) => {
  res.send('Archivo rol funcionando' )
})

/**
 * Ruta para obtener todos los roles del sistema
 * Método: GET
 * Endpoint: /obtenerRols
 * Controlador: obtenerRols
 */
router.get('/obtenerRols',obtenerRols)


module.exports = router