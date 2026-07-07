const { AppDataSource } = require('../config/db');

const crearEvaluacion = async (datos) => {
  const repo = AppDataSource.getRepository('Evaluacion');
  const nuevaEvaluacion = repo.create(datos);
  return await repo.save(nuevaEvaluacion);
};

const obtenerEvaluaciones = async () => {
  const repo = AppDataSource.getRepository('Evaluacion');
  return await repo.find({
    order: { fecha: 'DESC' } 
  });
};

const actualizarEvaluacion = async (id, datos) => {
  const repo = AppDataSource.getRepository('Evaluacion');
  const evaluacion = await repo.findOneBy({ id: id });
  if (!evaluacion) return null;
  repo.merge(evaluacion, datos);
  return await repo.save(evaluacion);
};

const eliminarEvaluacion = async (id) => {
  const repo = AppDataSource.getRepository('Evaluacion');
  const resultado = await repo.delete(id);
  return resultado.affected > 0;
};

module.exports = { crearEvaluacion, obtenerEvaluaciones, actualizarEvaluacion, eliminarEvaluacion };