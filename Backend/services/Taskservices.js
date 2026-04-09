const { db } = require('../config/firebase');
const {
  crearError,
  validarFechaFutura,
  validarPrioridad,
  mapearTarea,
  construirActualizacion,
} = require('../Utils/Taskutils');

const PRIORIDAD_ORDEN = {
  Alta: 0,
  Media: 1,
  Baja: 2,
};

const COLECCIONES = {
  TAREAS: 'tareas',
  USUARIOS: 'usuarios',
};

const ordenarPorPrioridad = (tareas) => {
  return [...tareas].sort((a, b) => {
    const prioridadA = PRIORIDAD_ORDEN[a.prioridad] ?? Object.keys(PRIORIDAD_ORDEN).length;
    const prioridadB = PRIORIDAD_ORDEN[b.prioridad] ?? Object.keys(PRIORIDAD_ORDEN).length;
    return prioridadA - prioridadB;
  });
};

const obtenerCargaActivaEmpleado = async (idEmpleado) => {
  const snapshot = await db
    .collection(COLECCIONES.TAREAS)
    .where('idEmpleado', '==', idEmpleado)
    .where('estado', 'in', ['activo', 'En Curso'])
    .get();

  return snapshot.size;
};

const obtenerNombreEmpleado = async (idEmpleado) => {
  if (!idEmpleado) return 'Sin asignar';

  const empleadoDoc = await db
    .collection(COLECCIONES.USUARIOS)
    .doc(idEmpleado)
    .get();

  if (!empleadoDoc.exists) return 'Sin asignar';

  const { nombre = '', apellido = '' } = empleadoDoc.data();
  const nombreCompleto = `${nombre} ${apellido}`.trim();

  return nombreCompleto || 'Sin asignar';
};

const obtenerTodasLasTareas = async () => {
  const snapshot = await db.collection(COLECCIONES.TAREAS).get();
  const tareas = snapshot.docs.map((doc) => mapearTarea(doc));
  return ordenarPorPrioridad(tareas);
};

const obtenerTareasPorEmpleado = async (idUsuario) => {
  const snapshot = await db
    .collection(COLECCIONES.TAREAS)
    .where('idEmpleado', '==', idUsuario)
    .get();

  const tareas = snapshot.docs.map((doc) => mapearTarea(doc));
  return ordenarPorPrioridad(tareas);
};

const obtenerTareasPorJefe = async (idJefe) => {
  const snapshot = await db
    .collection(COLECCIONES.TAREAS)
    .where('idJefe', '==', idJefe)
    .get();

  const tareas = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const tarea = doc.data();
      const nombreEmpleado = await obtenerNombreEmpleado(tarea.idEmpleado);

      return {
        id: doc.id,
        ...tarea,
        nombreEmpleado,
      };
    })
  );

  return ordenarPorPrioridad(tareas);
};

const crearTarea = async (datos) => {
  const { idEmpleado, idJefe, titulo, descripcion, fechaLimite, prioridad } = datos || {};

  if (!idEmpleado || idJefe === undefined || idJefe === null || !titulo || !descripcion || !fechaLimite || !prioridad) {
    throw crearError(400, 'Faltan campos requeridos');
  }

  if (!validarFechaFutura(fechaLimite)) {
    throw crearError(400, 'La fecha límite debe ser una fecha futura');
  }

  if (!validarPrioridad(prioridad)) {
    throw crearError(400, 'La prioridad debe ser Alta, Media o Baja');
  }

  const cargaActual = await obtenerCargaActivaEmpleado(idEmpleado);
  if (cargaActual >= 3) {
    throw crearError(400, 'El empleado ya tiene 3 tareas activas, no se pueden asignar más');
  }

  const nuevaTarea = {
    idEmpleado,
    idJefe,
    titulo,
    descripcion,
    fechaLimite,
    estado: 'activo',
    prioridad,
  };

  const docRef = await db.collection(COLECCIONES.TAREAS).add(nuevaTarea);

  return {
    id: docRef.id,
    ...nuevaTarea,
  };
};

const actualizarTareaPorId = async (id, body, camposPermitidos) => {
  if (!id) {
    throw crearError(400, 'Falta el ID de la tarea');
  }

  const updatedData = construirActualizacion(body, camposPermitidos);

  if (
    Object.prototype.hasOwnProperty.call(updatedData, 'fechaLimite') &&
    !validarFechaFutura(updatedData.fechaLimite)
  ) {
    throw crearError(400, 'La fecha límite debe ser una fecha futura');
  }

  if (Object.keys(updatedData).length === 0) {
    throw crearError(400, 'No se enviaron datos para actualizar');
  }

  await db.collection(COLECCIONES.TAREAS).doc(id).update(updatedData);

  return {
    id,
    ...updatedData,
  };
};




const actualizarTareasVencidas = async (idUsuario) => {
  if (!idUsuario) {
    throw crearError(400, 'Falta el ID del empleado');
  }

  const tareas = await obtenerTareasPorEmpleado(idUsuario);

  const tareasActualizadas = [];
  const ahora = Date.now();

  for (const tarea of tareas) {
    const fechaLimite = new Date(tarea.fechaLimite);
    const estaVencida = !Number.isNaN(fechaLimite.getTime()) && fechaLimite.getTime() < ahora;

    if (estaVencida && tarea.estado !== 'inactivo' && tarea.estado !== 'retrasada') {
      const tareaActualizada = await actualizarTareaPorId(tarea.id, { estado: 'retrasada' }, ['estado']);
      tareasActualizadas.push(tareaActualizada);
    }
  }

  console.log('Tareas vencidas actualizadas:', tareasActualizadas);
  return tareasActualizadas;
};

module.exports = {
  obtenerTodasLasTareas,
  obtenerTareasPorEmpleado,
  obtenerTareasPorJefe,
  crearTarea,
  actualizarTareaPorId,
  actualizarTareasVencidas,
};