require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./config/db');


const app = express(); 
const port = process.env.PORT || 3000; 

app.use(express.json()); // para que el servidor entienda datos en formato JSON

// conexión base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('Base de datos PostgreSQL conectada con éxito');
    
    // INICIO CRUD
    
    const alumnoRepository = AppDataSource.getRepository('Alumno');

    // CREATE: Crear un nuevo alumno (post)
    app.post('/alumnos', async (req, res) => {
      try {
        const nuevoAlumno = alumnoRepository.create(req.body);
        const resultado = await alumnoRepository.save(nuevoAlumno);
        res.status(201).json(resultado); 
      } catch (error) {
        res.status(400).json({ error: 'Error al crear el alumno, revisa los datos' });
      }
    });

    // READ: Listar todos los alumnos (get)
    app.get('/alumnos', async (req, res) => {
      // Realiza una consulta para encontrar todos los registros de la tabla
      const alumnos = await alumnoRepository.find();
      // Devuelve la lista en formato JSON
      res.json(alumnos);
    });

    // UPDATE: Actualizar datos parciales de un alumno específico (patch)
    app.patch('/alumnos/:id', async (req, res) => {
      try {
        // Captura el ID enviado como parámetro en la URL
        const id = parseInt(req.params.id);
        // Busca alumno que coincida con ID
        const alumno = await alumnoRepository.findOneBy({ id: id });
        
        // Si no existe, corta la ejecución y devuelve un error 404 (No encontrado)
        if (!alumno) {
          return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Sobrescribe los datos antiguos con los nuevos enviados en el body
        alumnoRepository.merge(alumno, req.body);
        const resultado = await alumnoRepository.save(alumno);
        res.json(resultado);
      } catch (error) {
        res.status(500).json({ error: 'Error interno al actualizar el alumno' });
      }
    });

    // DELETE: Eliminar un alumno por su ID (Método DELETE)
    app.delete('/alumnos/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        // Ejecuta la orden de borrado directo sobre el ID indicado
        const resultado = await alumnoRepository.delete(id);
        
        // Si la propiedad 'affected' es 0, significa que el ID no existía en la tabla
        if (resultado.affected === 0) {
          return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json({ mensaje: 'Alumno eliminado correctamente de la base de datos' });
      } catch (error) {
        res.status(500).json({ error: 'Error interno al intentar eliminar' });
      }
    });

    // FIN CRUD 

    // se enciende el servidor solo si la base de datos se conecta
    app.listen(port, () => {
      console.log(`Backend corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error fatal al conectar con la base de datos:', error);
  });