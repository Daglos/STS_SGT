const {
  createTaskGroup,
  getAllTaskGroups,
  getTaskGroupById,
  addTaskToGroup,
  updateGroupTask,
  getTasksAssignedToEmployee,
} = require('../repositories/taskGroupRepository');

async function addTaskGroup(req, res) {
  try {
    const { groupName, adminId, members = [] } = req.body;
    if (!groupName || !adminId) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    const group = await createTaskGroup({ groupName, adminId, members, tasks: [] });
    res.status(201).json({ success: true, message: 'Grupo de tareas creado', data: group });
  } catch (err) {
    console.error('Error creando grupo de tareas:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function listTaskGroups(req, res) {
  try {
    const groups = await getAllTaskGroups();
    res.status(200).json({ success: true, data: groups });
  } catch (err) {
    console.error('Error listando grupos de tareas:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getTaskGroup(req, res) {
  try {
    const { groupId } = req.params;
    if (!groupId) {
      return res.status(400).json({ success: false, error: 'Falta el ID del grupo' });
    }

    const group = await getTaskGroupById(groupId);
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    console.error('Error obteniendo grupo de tareas:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function addTaskToGroupController(req, res) {
  try {
    const { groupId } = req.params;
    const { titulo, descripcion, fechaLimite, prioridad, assignedEmployees = [], assignAll = false, idJefe } = req.body;

    if (!groupId || !titulo || !descripcion || !fechaLimite || !prioridad || !idJefe) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos para crear la tarea' });
    }

    const task = {
      titulo,
      descripcion,
      fechaLimite,
      prioridad,
      assignedEmployees: Array.isArray(assignedEmployees) ? assignedEmployees : [assignedEmployees],
      estado: 'activo',
      createdAt: new Date().toISOString(),
      idJefe,
    };

    const newTask = await addTaskToGroup(groupId, task, assignAll);
    res.status(201).json({ success: true, message: 'Tarea asignada al grupo', data: newTask });
  } catch (err) {
    console.error('Error asignando tarea al grupo:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function updateTaskInGroup(req, res) {
  try {
    const { groupId, taskId } = req.params;
    const { titulo, descripcion, fechaLimite, prioridad, estado, assignedEmployees } = req.body;

    if (!groupId || !taskId) {
      return res.status(400).json({ success: false, error: 'Falta el ID del grupo o de la tarea' });
    }

    const updatedTask = await updateGroupTask(groupId, taskId, {
      titulo,
      descripcion,
      fechaLimite,
      prioridad,
      estado,
      ...(assignedEmployees !== undefined && {
        assignedEmployees: Array.isArray(assignedEmployees) ? assignedEmployees : [assignedEmployees],
      }),
    });

    res.status(200).json({ success: true, message: 'Tarea grupal actualizada correctamente', data: updatedTask });
  } catch (err) {
    console.error('Error actualizando tarea grupal:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getTasksForEmployee(req, res) {
  try {
    const { idUsuario } = req.params;
    if (!idUsuario) {
      return res.status(400).json({ success: false, error: 'Falta el ID del empleado' });
    }

    const tasks = await getTasksAssignedToEmployee(idUsuario);
    res.status(200).json({ success: true, data: tasks, total: tasks.length });
  } catch (err) {
    console.error('Error obteniendo tareas para empleado:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  addTaskGroup,
  listTaskGroups,
  getTaskGroup,
  addTaskToGroup: addTaskToGroupController,
  updateTaskInGroup,
  getTasksForEmployee,
};