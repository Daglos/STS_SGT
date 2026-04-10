const express = require('express');
const router = express.Router();
const {
  addTaskGroup,
  listTaskGroups,
  getTaskGroup,
  addTaskToGroup,
  updateTaskInGroup,
  getTasksForEmployee,
} = require('../controllers/taskGroupController');

router.post('/taskGroup', addTaskGroup); // Crear grupo de tareas
router.post('/taskGroup/:groupId/task', addTaskToGroup); // Asignar tarea al grupo
router.put('/taskGroup/:groupId/task/:taskId', updateTaskInGroup); // Actualizar tarea grupal
router.get('/taskGroups', listTaskGroups); // Listar todos los grupos de tareas
router.get('/taskGroup/:groupId', getTaskGroup); // Obtener detalles de un grupo de tareas
router.get('/taskGroups/employee/:idUsuario', getTasksForEmployee); // Tareas de un empleado dentro de grupos

module.exports = router;