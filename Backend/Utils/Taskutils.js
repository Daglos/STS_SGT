const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
const PRIORIDADES_VALIDAS = ['Alta', 'Media', 'Baja'];

const crearError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validarFechaFutura = (fecha) => {
  const fechaObjetivo = new Date(fecha);

  if (Number.isNaN(fechaObjetivo.getTime())) return false;

  return fechaObjetivo.getTime() > Date.now();
};

const validarPrioridad = (prioridad) => {
  return PRIORIDADES_VALIDAS.includes(prioridad);
};

const calcularPrioridad = (fechaLimite, cargaActual) => {
  const diasRestantes = Math.ceil(
    (new Date(fechaLimite).getTime() - Date.now()) / MILISEGUNDOS_POR_DIA
  );

  if (diasRestantes <= 2 || cargaActual >= 5) return 'Alta';
  if (diasRestantes <= 5 || cargaActual >= 3) return 'Media';
  return 'Baja';
};

const mapearTarea = (doc, extras = {}) => ({
  id: doc.id,
  ...doc.data(),
  ...extras,
});

const construirActualizacion = (body, camposPermitidos) => {
  return camposPermitidos.reduce((acc, campo) => {
    if (body[campo] !== undefined) {
      acc[campo] = body[campo];
    }
    return acc;
  }, {});
};

module.exports = {
  crearError,
  validarFechaFutura,
  validarPrioridad,
  calcularPrioridad,
  mapearTarea,
  construirActualizacion,
};