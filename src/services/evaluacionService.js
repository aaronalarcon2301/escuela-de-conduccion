const { AppDataSource } = require('../config/db');

const crearEvaluacion = async (datos) => {
  const repository = AppDataSource.getRepository('EvaluacionPractica');
  const nuevaEvaluacion = repository.create(datos);
  return await repository.save(nuevaEvaluacion);
};

const obtenerEvaluaciones = async () => {
  const repository = AppDataSource.getRepository('EvaluacionPractica');
  return await repository.find();
};

const obtenerEvaluacionesPorAlumno = async (alumnoId) => {
  const repository = AppDataSource.getRepository('EvaluacionPractica');
  // Busca todas las evaluaciones que coincidan con el ID del alumno
  return await repository.find({ where: { alumno: { id: alumnoId } } }); 
};

const actualizarEvaluacion = async (id, datos) => {
  const repository = AppDataSource.getRepository('EvaluacionPractica');
  const evaluacion = await repository.findOneBy({ id: id });
  
  if (!evaluacion) return null;

  repository.merge(evaluacion, datos);
  return await repository.save(evaluacion);
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