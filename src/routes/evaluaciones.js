const express = require('express');

function aplicarFiltrosEvaluaciones(items, query) {
  let resultado = [...items];
  const alumnoId = Number.parseInt(query.alumnoId, 10);
  if (!Number.isNaN(alumnoId)) {
    resultado = resultado.filter((item) => item.alumnoId === alumnoId);
  }

  const instructorId = Number.parseInt(query.instructorId, 10);
  if (!Number.isNaN(instructorId)) {
    resultado = resultado.filter((item) => item.instructorId === instructorId);
  }

  const resultadoEvaluacion = query.resultado?.toString().trim().toLowerCase();
  if (resultadoEvaluacion) {
    resultado = resultado.filter((item) => item.resultado?.toLowerCase().includes(resultadoEvaluacion));
  }

  return resultado;
}

function registerEvaluacionRoutes(app, deps) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const resultado = await deps.createEvaluacion(req.body);
      if (!resultado) {
        return res.status(404).json({ error: 'Alumno o instructor no encontrado' });
      }
      res.status(201).json({
        ...resultado,
        mensaje: deps.obtenerMensajeResultado(resultado.resultado),
      });
    } catch (error) {
      res.status(400).json({ error: 'Error al registrar la evaluación práctica, revisa los datos' });
    }
  });

  router.get('/', async (req, res) => {
    const evaluaciones = await deps.listEvaluaciones();
    res.json(aplicarFiltrosEvaluaciones(evaluaciones, req.query));
  });

  router.get('/alumnos/:id/evaluaciones', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const alumno = await deps.getAlumnoPorId(id);
      if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
      }
      const evaluaciones = await deps.listEvaluacionesByAlumno(id);
      res.json(evaluaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error interno al consultar el historial del alumno' });
    }
  });

  router.patch('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const evaluacion = await deps.updateEvaluacion(id, req.body);
      if (!evaluacion) {
        return res.status(404).json({ error: 'Evaluación no encontrada' });
      }
      res.json(evaluacion);
    } catch (error) {
      res.status(500).json({ error: 'Error interno al actualizar la evaluación' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const resultado = await deps.deleteEvaluacion(id);
      if (!resultado) {
        return res.status(404).json({ error: 'Evaluación no encontrada' });
      }
      res.json({ mensaje: 'Evaluación eliminada correctamente de la base de datos' });
    } catch (error) {
      res.status(500).json({ error: 'Error interno al intentar eliminar la evaluación' });
    }
  });

  app.use('/evaluaciones-practicas', router);
}

module.exports = { registerEvaluacionRoutes };
