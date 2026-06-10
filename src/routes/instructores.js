const express = require('express');

function aplicarFiltrosInstructores(items, query) {
  let resultado = [...items];
  const nombre = query.nombre?.toString().trim().toLowerCase();
  if (nombre) {
    resultado = resultado.filter((item) => item.nombre?.toLowerCase().includes(nombre));
  }

  const rut = query.rut?.toString().trim().toLowerCase();
  if (rut) {
    resultado = resultado.filter((item) => item.rut?.toLowerCase().includes(rut));
  }

  const email = query.email?.toString().trim().toLowerCase();
  if (email) {
    resultado = resultado.filter((item) => item.email?.toLowerCase().includes(email));
  }

  const tipoLicencia = query.tipoLicencia?.toString().trim().toLowerCase();
  if (tipoLicencia) {
    resultado = resultado.filter((item) => item.tipoLicencia?.toLowerCase().includes(tipoLicencia));
  }

  const id = Number.parseInt(query.id, 10);
  if (!Number.isNaN(id)) {
    resultado = resultado.filter((item) => item.id === id);
  }

  return resultado;
}

function registerInstructorRoutes(app, deps) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const resultado = await deps.createInstructor(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el instructor, revisa los datos' });
    }
  });

  router.get('/', async (req, res) => {
    const instructores = await deps.listInstructores();
    res.json(aplicarFiltrosInstructores(instructores, req.query));
  });

  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'El id del instructor debe ser un número' });
      }

      const instructor = await deps.getInstructorPorId(id);
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor no encontrado' });
      }
      res.json(instructor);
    } catch (error) {
      res.status(500).json({ error: 'No se pudo consultar el instructor' });
    }
  });

  router.patch('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'El id del instructor debe ser un número' });
      }

      const instructor = await deps.updateInstructor(id, req.body);
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor no encontrado' });
      }
      res.json(instructor);
    } catch (error) {
      res.status(500).json({ error: 'Error interno al actualizar el instructor' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'El id del instructor debe ser un número' });
      }

      const instructor = await deps.updateInstructor(id, req.body);
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor no encontrado' });
      }
      res.json(instructor);
    } catch (error) {
      res.status(500).json({ error: 'Error interno al actualizar el instructor' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const resultado = await deps.deleteInstructor(id);
      if (!resultado) {
        return res.status(404).json({ error: 'Instructor no encontrado' });
      }
      res.json({ mensaje: 'Instructor eliminado correctamente de la base de datos' });
    } catch (error) {
      res.status(500).json({ error: 'Error interno al intentar eliminar el instructor' });
    }
  });

  app.use('/instructores', router);
}

module.exports = { registerInstructorRoutes };
