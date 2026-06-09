const { AppDataSource } = require('../config/db');

const alumnoRepository = AppDataSource.getRepository('Alumno');

// Crear un nuevo alumno
const crearAlumno = async (req, res) => {
  try {
    const nuevoAlumno = alumnoRepository.create(req.body);
    const resultado = await alumnoRepository.save(nuevoAlumno);
    res.status(201).json(resultado); 
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el alumno, revisa los datos' });
  }
};

// lista todos los alumnos
const obtenerAlumnos = async (req, res) => {
  const alumnos = await alumnoRepository.find();
  res.json(alumnos);
};

// actualiza datos parciales
const actualizarAlumno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const alumno = await alumnoRepository.findOneBy({ id: id });
    
    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    alumnoRepository.merge(alumno, req.body);
    const resultado = await alumnoRepository.save(alumno);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error interno al actualizar el alumno' });
  }
};

// Elimina un alumno por su ID
const eliminarAlumno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await alumnoRepository.delete(id);
    
    if (resultado.affected === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json({ mensaje: 'Alumno eliminado correctamente de la base de datos' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno al intentar eliminar' });
  }
};

module.exports = {
  crearAlumno,
  obtenerAlumnos,
  actualizarAlumno,
  eliminarAlumno
};