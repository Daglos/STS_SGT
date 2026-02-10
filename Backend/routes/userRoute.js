const express = require('express')
const router = express.Router()

const {obtenerUser, crearUser, actualizarUser, actualizarState, solicitarCambioContrasena, cambiarContrasena} = require('../controllers/userController')

/**
 * Ruta de prueba para verificar que el módulo esté funcionando
 */
router.get('/', (req, res) => {
  res.send('Archivo user funcionando' )
})

/**
 * Ruta para obtener todos los usuarios del sistema
 * Método: GET
 * Endpoint: /obtenerUsers
 * Controlador: obtenerUser
 */
router.get('/obtenerUsers',obtenerUser)

/**
 * Ruta para crear un nuevo usuario
 * Método: POST
 * Endpoint: /crearUsers
 * Controlador: crearUser
 */
router.post('/crearUsers',crearUser)

/**
 * Ruta para actualizar los datos de un usuario
 * Método: PUT
 * Endpoint: /actualizarUsers
 * Controlador: actualizarUser
 */
router.put('/actualizarUsers',actualizarUser)

/**
 * Ruta para actualizar el estado de un usuario
 * Método: PUT
 * Endpoint: /actualizarState
 * Controlador: actualizarState
 */
router.put('/actualizarState',actualizarState)

/**
 * Ruta para solicitar un código de verificación para cambio de contraseña
 * Método: POST
 * Endpoint: /solicitarCambioContrasena
 * Controlador: solicitarCambioContrasena
 */
router.post('/solicitarCambioContrasena', solicitarCambioContrasena)

/**
 * Ruta para cambiar la contraseña usando el código de verificación
 * Método: PUT
 * Endpoint: /cambiarContrasena
 * Controlador: cambiarContrasena
 */
router.put('/cambiarContrasena', cambiarContrasena)

module.exports = router