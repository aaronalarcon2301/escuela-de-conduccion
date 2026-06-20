const { AppDataSource } = require('../config/db');

const crearAlumno = async (datos) => {
  const alumnoRepository = AppDataSource.getRepository('Alumno');
  const nuevoAlumno = alumnoRepository.create(datos);
  return await alumnoRepository.save(nuevoAlumno);
};

const obtenerAlumnos = async () => {
  const alumnoRepository = AppDataSource.getRepository('Alumno');
  return await alumnoRepository.find();
};

const actualizarAlumno = async (id, datos) => {
  const alumnoRepository = AppDataSource.getRepository('Alumno');
  const alumno = await alumnoRepository.findOneBy({ id: id });
  
  if (!alumno) return null; // Retorna null si no lo encuentra

  alumnoRepository.merge(alumno, datos);
  return await alumnoRepository.save(alumno);
};

const eliminarAlumno = async (id) => {
  const alumnoRepository = AppDataSource.getRepository('Alumno');
  const resultado = await alumnoRepository.delete(id);
  
  return resultado.affected > 0; // Retorna true si eliminó algo, false si no
};

module.exports = {
  crearAlumno,
  obtenerAlumnos,
  actualizarAlumno,
  eliminarAlumno
};