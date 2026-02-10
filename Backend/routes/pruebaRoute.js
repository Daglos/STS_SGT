const express = require('express')
const router = express.Router()

const {obtenerprueba} = require('../controllers/pruebaController')

/**
 * Ruta de prueba para verificar que el módulo esté funcionando
 */
router.get('/', (req, res) => {
  res.send('Archivo prueba funcionando' )
})

/**
 * Ruta para obtener datos de prueba
 * Método: GET
 * Endpoint: /obtenerprueba
 * Controlador: obtenerprueba
 */
router.get('/obtenerprueba',obtenerprueba)


module.exports = router