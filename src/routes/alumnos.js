const express = require('express');

function aplicarFiltrosAlumnos(items, query) {
  let resultado = [...items];
  const nombre = query.nombre?.toString().trim().toLowerCase();
  if (nombre) {
    resultado = resultado.filter((item) => item.nombre?.toLowerCase().includes(nombre));
  }

  const email = query.email?.toString().trim().toLowerCase();
  if (email) {
    resultado = resultado.filter((item) => item.email?.toLowerCase().includes(email));
  }

  const id = Number.parseInt(query.id, 10);
  if (!Number.isNaN(id)) {
    resultado = resultado.filter((item) => item.id === id);
  }

  return resultado;
}

function registerAlumnoRoutes(app, deps) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const resultado = await deps.createAlumno(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el alumno, revisa los datos' });
    }
  });

  router.get('/', async (req, res) => {
    const alumnos = await deps.listAlumnos();
    res.json(aplicarFiltrosAlumnos(alumnos, req.query));
  });

  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'El id del alumno debe ser un número' });
      }

      const alumno = await deps.getAlumnoPorId(id);
      if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
      }
      res.json(alumno);
    } catch (error) {
      res.status(500).json({ error: 'No se pudo consultar el alumno' });
    }
  });

  router.patch('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'El id del alumno debe ser un número' });
      }

      const alumno = await deps.updateAlumno(id, req.body);
      if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
      }
      res.json(alumno);
    } catch (error) {
      res.status(500).json({ error: 'Error interno al actualizar el alumno' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'El id del alumno debe ser un número' });
      }

      const alumno = await deps.updateAlumno(id, req.body);
      if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
      }
      res.json(alumno);
    } catch (error) {
      res.status(500).json({ error: 'Error interno al actualizar el alumno' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const resultado = await deps.deleteAlumno(id);
      if (!resultado) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
      }
      res.json({ mensaje: 'Alumno eliminado correctamente de la base de datos' });
    } catch (error) {
      res.status(500).json({ error: 'Error interno al intentar eliminar' });
    }
  });

  app.use('/alumnos', router);
}

module.exports = { registerAlumnoRoutes };
