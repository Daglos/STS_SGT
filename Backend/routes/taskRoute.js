const express = require('express')
const router = express.Router()

const {obtenerTasks, obtenerTaskPorId, obtenerTaskPorIdJefe, crearTask, actualizarTask, actualizarState} = require('../controllers/taskController')

/**
 * Ruta de prueba para verificar que el módulo esté funcionando
 */
router.get('/', (req, res) => {
  res.send('Archivo task funcionando' )
})

/**
 * Ruta para obtener todas las tareas del sistema
 * Método: GET
 * Endpoint: /obtenerTasks
 * Controlador: obtenerTasks
 */
router.get('/obtenerTasks',obtenerTasks)


/**
 * Ruta para obtener las tareas de un usuario específico
 * Método: GET
 * Endpoint: /obtenerTaskPorId
 * Controlador: obtenerTaskPorId
 */
router.get('/obtenerTaskPorId', obtenerTaskPorId)

/**
 * Ruta para obtener las tareas de un usuario específico
 * Método: GET
 * Endpoint: /obtenerTaskPorId
 * Controlador: obtenerTaskPorId
 */
router.get('/obtenerTaskPorIdJefe', obtenerTaskPorIdJefe)

/**
 * Ruta para crear una nueva tarea
 * Método: POST
 * Endpoint: /crearTask
 * Controlador: crearTask
 */
router.post('/crearTask',crearTask)

/**
 * Ruta para actualizar los datos de una tarea
 * Método: PUT
 * Endpoint: /actualizarTask
 * Controlador: actualizarTask
 */
router.put('/actualizarTask',actualizarTask)

/**
 * Ruta para actualizar el estado de una tarea
 * Método: PUT
 * Endpoint: /actualizarState
 * Controlador: actualizarState
 */
router.put('/actualizarState',actualizarState)


module.exports = router