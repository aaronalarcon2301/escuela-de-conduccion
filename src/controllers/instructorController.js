const instructorService = require('../services/instructorService');

const crearInstructor = async (req, res) => {
  try {
    const resultado = await instructorService.crearInstructor(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el instructor' });
  }
};

const obtenerInstructores = async (req, res) => {
  try {
    const instructores = await instructorService.obtenerInstructores();
    res.json(instructores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener instructores' });
  }
};

const obtenerInstructorPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const instructor = await instructorService.obtenerInstructorPorId(id);
    
    if (!instructor) return res.status(404).json({ error: 'Instructor no encontrado' });
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar instructor' });
  }
};

const actualizarInstructor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await instructorService.actualizarInstructor(id, req.body);
    
    if (!resultado) return res.status(404).json({ error: 'Instructor no encontrado' });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error interno al actualizar' });
  }
};

const eliminarInstructor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = await instructorService.eliminarInstructor(id);
    
    if (!eliminado) return res.status(404).json({ error: 'Instructor no encontrado' });
    res.json({ mensaje: 'Instructor eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

module.exports = {
  crearInstructor,
  obtenerInstructores,
  obtenerInstructorPorId,
  actualizarInstructor,
  eliminarInstructor
};