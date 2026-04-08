const taskService = require('../services/Taskservices');

const manejarError = (res, error, mensajePorDefecto = 'Error interno del servidor') => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    error: error.message || mensajePorDefecto,
  });
};

const obtenerTasks = async (req, res) => {
  try {
    const tareas = await taskService.obtenerTodasLasTareas();

    return res.json({
      success: true,
      data: tareas,
      total: tareas.length,
    });
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return manejarError(res, error, 'Error al obtener las tareas');
  }
};

const filtrarTasks = async (req, res) => {
  return res.status(501).json({
    success: false,
    error: 'Función pendiente de implementación',
  });
};

const obtenerTaskPorIdJefe = async (req, res) => {
  try {
    const { idjefe } = req.query;

    if (!idjefe) {
      return res.status(400).json({
        success: false,
        error: 'Falta el ID del jefe',
      });
    }

    const tasks = await taskService.obtenerTareasPorJefe(idjefe);

    return res.json({
      success: true,
      data: tasks,
      total: tasks.length,
    });
  } catch (error) {
    console.error('Error al obtener tareas del jefe:', error);
    return manejarError(res, error, 'Error al obtener tareas');
  }
};

const obtenerTaskPorId = async (req, res) => {
  try {
    const { idUsuario } = req.query;

    if (!idUsuario) {
      return res.status(400).json({
        success: false,
        error: 'Falta el ID del usuario',
      });
    }

    const tasks = await taskService.obtenerTareasPorEmpleado(idUsuario);

    return res.json({
      success: true,
      data: tasks,
      total: tasks.length,
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return manejarError(res, error, 'Error al obtener tareas');
  }
};

const crearTask = async (req, res) => {
  try {
    const nuevaTarea = await taskService.crearTarea(req.body);

    return res.status(201).json({
      success: true,
      message: 'Tarea agregada exitosamente',
      data: nuevaTarea,
    });
  } catch (error) {
    console.error('Error al agregar la tarea:', error);
    return manejarError(res, error, 'Error al agregar la tarea');
  }
};

const actualizarTask = async (req, res) => {
  try {
    const { id } = req.query;
    const { idEmpleado, idJefe, titulo, descripcion, fechaLimite, estado } = req.body || {};

    const actualizada = await taskService.actualizarTareaPorId(
      id,
      { idEmpleado, idJefe, titulo, descripcion, fechaLimite, estado },
      ['idEmpleado', 'idJefe', 'titulo', 'descripcion', 'fechaLimite', 'estado']
    );

    return res.status(200).json({
      success: true,
      message: 'Tarea actualizada correctamente',
      data: actualizada,
    });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    return manejarError(res, error, 'Error al actualizar la tarea');
  }
};

const actualizarState = async (req, res) => {
  try {
    const { id } = req.query;
    const { estado } = req.body || {};

    const actualizada = await taskService.actualizarTareaPorId(
      id,
      { estado },
      ['estado']
    );

    return res.status(200).json({
      success: true,
      message: 'Estado actualizado correctamente',
      data: actualizada,
    });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    return manejarError(res, error, 'Error al actualizar el estado');
  }
};

module.exports = {
  obtenerTasks,
  filtrarTasks,
  obtenerTaskPorId,
  obtenerTaskPorIdJefe,
  crearTask,
  actualizarTask,
  actualizarState,
};