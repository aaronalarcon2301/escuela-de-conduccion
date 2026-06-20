const alumnoService = require('../services/alumnoService');

const crearAlumno = async (req, res) => {
  try {
    const resultado = await alumnoService.crearAlumno(req.body);
    res.status(201).json(resultado); 
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el alumno, revisa los datos' });
  }
};

const obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await alumnoService.obtenerAlumnos();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ error: 'Error interno al obtener alumnos' });
  }
};

const actualizarAlumno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await alumnoService.actualizarAlumno(id, req.body);
    
    if (!resultado) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error interno al actualizar el alumno' });
  }
};

const eliminarAlumno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = await alumnoService.eliminarAlumno(id);
    
    if (!eliminado) {
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