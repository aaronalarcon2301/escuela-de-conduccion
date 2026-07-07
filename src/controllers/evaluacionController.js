const evaluacionService = require('../services/evaluacionService');

const crearEvaluacion = async (req, res) => {
  try {
    const resultado = await evaluacionService.crearEvaluacion(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la evaluación' });
  }
};

const obtenerEvaluaciones = async (req, res) => {
  try {
    const evaluaciones = await evaluacionService.obtenerEvaluaciones();
    res.json(evaluaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
};

const actualizarEvaluacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await evaluacionService.actualizarEvaluacion(id, req.body);
    if (!resultado) return res.status(404).json({ error: 'Evaluación no encontrada' });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

const eliminarEvaluacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = await evaluacionService.eliminarEvaluacion(id);
    if (!eliminado) return res.status(404).json({ error: 'Evaluación no encontrada' });
    res.json({ mensaje: 'Evaluación eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

module.exports = { crearEvaluacion, obtenerEvaluaciones, actualizarEvaluacion, eliminarEvaluacion };