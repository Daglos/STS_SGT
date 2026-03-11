const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middleware/AuthMiddleware');
const { obtenerTasks, obtenerTaskPorId, crearTask, actualizarTask, actualizarState } = require('../controllers/taskController');

/**
 * Ruta de prueba para verificar que el módulo esté funcionando
 */
router.get('/', (req, res) => {
  res.send('Archivo task funcionando');
});

/**
 * Obtener todas las tareas (solo admins y jefes)
 */
router.get('/obtenerTasks', verificarToken, verificarRol(['admin','jefe']), obtenerTasks);

/**
 * Obtener tareas por ID de usuario (el mismo usuario o admin)
 */
router.get('/obtenerTaskPorId', verificarToken, async (req, res, next) => {
  // Solo dejar pasar si el usuario es admin o si es su propia tarea
  if (req.user.rol === 'admin') return next();
  req.params.uid = req.user.uid;
  next();
}, obtenerTaskPorId);

/**
 * Crear tarea (solo admins y jefes)
 */
router.post('/crearTask', verificarToken, verificarRol(['admin','jefe']), crearTask);

/**
 * Actualizar tarea (solo admins y jefes)
 */
router.put('/actualizarTask', verificarToken, verificarRol(['admin','jefe']), actualizarTask);

/**
 * Actualizar estado de tarea (usuarios dueños de la tarea o admins)
 */
router.put('/actualizarState', verificarToken, async (req, res, next) => {
  if (req.user.rol === 'admin') return next();
  req.body.uid = req.user.uid; // solo puede actualizar su propia tarea
  next();
}, actualizarState);

module.exports = router;