const { AppDataSource } = require('../config/db');

const crearInstructor = async (datos) => {
  const repository = AppDataSource.getRepository('Instructor');
  const nuevoInstructor = repository.create(datos);
  return await repository.save(nuevoInstructor);
};

const obtenerInstructores = async () => {
  const repository = AppDataSource.getRepository('Instructor');
  return await repository.find();
};

const obtenerInstructorPorId = async (id) => {
  const repository = AppDataSource.getRepository('Instructor');
  return await repository.findOneBy({ id: id });
};

const actualizarInstructor = async (id, datos) => {
  const repository = AppDataSource.getRepository('Instructor');
  const instructor = await repository.findOneBy({ id: id });
  
  if (!instructor) return null;

  repository.merge(instructor, datos);
  return await repository.save(instructor);
};

const eliminarInstructor = async (id) => {
  const repository = AppDataSource.getRepository('Instructor');
  const resultado = await repository.delete(id);
  return resultado.affected > 0;
};

module.exports = {
  crearInstructor,
  obtenerInstructores,
  obtenerInstructorPorId,
  actualizarInstructor,
  eliminarInstructor
};