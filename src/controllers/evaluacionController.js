const evaluacionService = require('../services/evaluacionService');

const crearEvaluacion = async (req, res) => {
  try {
    const { evaluacion, mensaje } = await evaluacionService.crearEvaluacion(req.body);
    res.status(201).json({ evaluacion, mensaje });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al registrar la evaluación práctica, revisa los datos' });
  }
};

const obtenerEvaluaciones = async (req, res) => {
  try {
    const evaluaciones = await evaluacionService.obtenerEvaluaciones();
    res.json(evaluaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las evaluaciones' });
  }
};

const obtenerEvaluacionesPorAlumno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const evaluaciones = await evaluacionService.obtenerEvaluacionesPorAlumno(id);
    res.json(evaluaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar el historial del alumno' });
  }
};

const actualizarEvaluacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await evaluacionService.actualizarEvaluacion(id, req.body);

    if (!resultado) return res.status(404).json({ error: 'Evaluación no encontrada' });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error interno al actualizar la evaluación' });
  }
};

const eliminarEvaluacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = await evaluacionService.eliminarEvaluacion(id);

    if (!eliminado) return res.status(404).json({ error: 'Evaluación no encontrada' });
    res.json({ mensaje: 'Evaluación eliminada correctamente de la base de datos' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno al intentar eliminar la evaluación' });
  }
};

module.exports = {
  crearEvaluacion,
  obtenerEvaluaciones,
  obtenerEvaluacionesPorAlumno,
  actualizarEvaluacion,
  eliminarEvaluacion
};