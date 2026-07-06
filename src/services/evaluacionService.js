const { AppDataSource } = require('../config/db');
const { calcularResultadoEvaluacion, obtenerMensajeResultado } = require('../validations/evaluacion');

const crearEvaluacion = async (datos) => {
  const alumnoRepository = AppDataSource.getRepository('Alumno');
  const instructorRepository = AppDataSource.getRepository('Instructor');
  const repository = AppDataSource.getRepository('EvaluacionPractica');

  const alumno = await alumnoRepository.findOneBy({ id: datos.alumnoId });
  if (!alumno) {
    throw new Error('El alumno seleccionado no existe');
  }

  const instructor = await instructorRepository.findOneBy({ id: datos.instructorId });
  if (!instructor) {
    throw new Error('El instructor seleccionado no existe');
  }

  // El resultado NUNCA se recibe del cliente: lo calcula el sistema
  // automáticamente según los criterios evaluados.
  const resultado = calcularResultadoEvaluacion(datos);

  const nuevaEvaluacion = repository.create({ ...datos, resultado });
  const evaluacionGuardada = await repository.save(nuevaEvaluacion);

  return {
    evaluacion: evaluacionGuardada,
    mensaje: obtenerMensajeResultado(resultado),
  };
};

const obtenerEvaluaciones = async () => {
  const repository = AppDataSource.getRepository('EvaluacionPractica');
  return await repository.find();
};

const obtenerEvaluacionesPorAlumno = async (alumnoId) => {
  const repository = AppDataSource.getRepository('EvaluacionPractica');
  // Corregido: alumnoId es una columna simple, no una relación "alumno".
  return await repository.find({ where: { alumnoId } });
};

const actualizarEvaluacion = async (id, datos) => {
  const repository = AppDataSource.getRepository('EvaluacionPractica');
  const evaluacion = await repository.findOneBy({ id: id });

  if (!evaluacion) return null;

  // Si se modifica algún criterio, se recalcula el resultado automáticamente.
  const criteriosModificados =
    datos.estacionamiento !== undefined ||
    datos.controlVehiculo !== undefined ||
    datos.respetoSenales !== undefined;

  if (criteriosModificados) {
    datos.resultado = calcularResultadoEvaluacion({
      estacionamiento: datos.estacionamiento ?? evaluacion.estacionamiento,
      controlVehiculo: datos.controlVehiculo ?? evaluacion.controlVehiculo,
      respetoSenales: datos.respetoSenales ?? evaluacion.respetoSenales,
    });
  }

  repository.merge(evaluacion, datos);
  const evaluacionActualizada = await repository.save(evaluacion);

  return {
    evaluacion: evaluacionActualizada,
    mensaje: obtenerMensajeResultado(evaluacionActualizada.resultado),
  };
};

const eliminarEvaluacion = async (id) => {
  const repository = AppDataSource.getRepository('EvaluacionPractica');
  const resultado = await repository.delete(id);

  return resultado.affected > 0;
};

module.exports = {
  crearEvaluacion,
  obtenerEvaluaciones,
  obtenerEvaluacionesPorAlumno,
  actualizarEvaluacion,
  eliminarEvaluacion
};