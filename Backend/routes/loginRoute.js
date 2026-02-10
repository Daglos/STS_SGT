const express = require('express')
const router = express.Router()

const {iniciarSesion} = require('../controllers/loginController')

/**
 * Ruta de prueba para verificar que el módulo esté funcionando
 */
router.get('/', (req, res) => {
  res.send('Archivo login funcionando' )
})

/**
 * Ruta para autenticar usuarios en el sistema
 * Método: POST
 * Endpoint: /login
 * Controlador: iniciarSesion
 */
router.post('/login',iniciarSesion)

module.exports = router