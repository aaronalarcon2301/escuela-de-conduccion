const { AppDataSource } = require('../config/db');

const crearAlumno = async (datos) => {
  const alumnoRepository = AppDataSource.getRepository('Alumno');

  if (datos.rut) {
    const rutExistente = await alumnoRepository.findOneBy({ rut: datos.rut });
    if (rutExistente) throw new Error('El RUT ya se encuentra registrado en el sistema.');
  }

  if (datos.email) {
    const emailExistente = await alumnoRepository.findOneBy({ email: datos.email });
    if (emailExistente) throw new Error('El correo electrónico ya se encuentra registrado.');
  }

  if (datos.telefono) {
    const telefonoExistente = await alumnoRepository.findOneBy({ telefono: datos.telefono });
    if (telefonoExistente) throw new Error('El número de teléfono ya se encuentra registrado.');
  }

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
  
  if (!alumno) return null;

  if (datos.rut && datos.rut !== alumno.rut) {
    const rutExistente = await alumnoRepository.findOneBy({ rut: datos.rut });
    if (rutExistente) throw new Error('El RUT ingresado ya pertenece a otro alumno.');
  }

  if (datos.email && datos.email !== alumno.email) {
    const emailExistente = await alumnoRepository.findOneBy({ email: datos.email });
    if (emailExistente) throw new Error('El correo electrónico ingresado ya pertenece a otro alumno.');
  }

  if (datos.telefono && datos.telefono !== alumno.telefono) {
    const telefonoExistente = await alumnoRepository.findOneBy({ telefono: datos.telefono });
    if (telefonoExistente) throw new Error('El número de teléfono ingresado ya pertenece a otro alumno.');
  }

  alumnoRepository.merge(alumno, datos);
  return await alumnoRepository.save(alumno);
};

const eliminarAlumno = async (id) => {
  const alumnoRepository = AppDataSource.getRepository('Alumno');
  const resultado = await alumnoRepository.delete(id);
  
  return resultado.affected > 0;
};

module.exports = {
  crearAlumno,
  obtenerAlumnos,
  actualizarAlumno,
  eliminarAlumno
};