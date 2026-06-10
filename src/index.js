require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./config/db');
const { calcularResultadoEvaluacion, obtenerMensajeResultado } = require('./utils/evaluacion');
const { createDemoStore } = require('./demoStore');
const { registerAlumnoRoutes } = require('./routes/alumnos');
const { registerInstructorRoutes } = require('./routes/instructores');
const { registerEvaluacionRoutes } = require('./routes/evaluaciones');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('X-Api-Owner', 'Escuela de conducción');
  res.setHeader('X-Contexto', 'Gestión de la escuela de conducción');
  res.setHeader('X-Proposito', 'Registrar alumnos, instructores y evaluaciones');
  next();
});

async function startServer() {
  let dbReady = false;
  let alumnoRepository = null;
  let instructorRepository = null;
  let evaluacionRepository = null;
  let demoStore = null;

  try {
    await AppDataSource.initialize();
    dbReady = true;
    console.log('Base de datos PostgreSQL conectada con éxito');
  } catch (error) {
    console.warn('No se pudo conectar a PostgreSQL. Ejecutando en modo demo con almacenamiento local.');
    demoStore = createDemoStore();
  }

  if (dbReady) {
    alumnoRepository = AppDataSource.getRepository('Alumno');
    instructorRepository = AppDataSource.getRepository('Instructor');
    evaluacionRepository = AppDataSource.getRepository('EvaluacionPractica');
  }

  const listAlumnos = async () => (dbReady ? alumnoRepository.find() : demoStore.listAlumnos());
  const getAlumnoPorId = async (id) => (dbReady ? alumnoRepository.findOneBy({ id }) : demoStore.getAlumnoById(id));
  const createAlumno = async (body) => {
    if (!dbReady) {
      return demoStore.createAlumno(body);
    }
    const nuevoAlumno = alumnoRepository.create(body);
    return alumnoRepository.save(nuevoAlumno);
  };
  const updateAlumno = async (id, body) => {
    if (!dbReady) {
      return demoStore.updateAlumno(id, body);
    }
    const alumno = await alumnoRepository.findOneBy({ id });
    if (!alumno) {
      return null;
    }
    alumnoRepository.merge(alumno, body);
    return alumnoRepository.save(alumno);
  };
  const deleteAlumno = async (id) => {
    if (!dbReady) {
      return demoStore.deleteAlumno(id);
    }
    const resultado = await alumnoRepository.delete(id);
    return resultado.affected > 0;
  };

  const listInstructores = async () => (dbReady ? instructorRepository.find() : demoStore.listInstructores());
  const getInstructorPorId = async (id) => (dbReady ? instructorRepository.findOneBy({ id }) : demoStore.getInstructorById(id));
  const createInstructor = async (body) => {
    if (!dbReady) {
      return demoStore.createInstructor(body);
    }
    const nuevoInstructor = instructorRepository.create(body);
    return instructorRepository.save(nuevoInstructor);
  };
  const updateInstructor = async (id, body) => {
    if (!dbReady) {
      return demoStore.updateInstructor(id, body);
    }
    const instructor = await instructorRepository.findOneBy({ id });
    if (!instructor) {
      return null;
    }
    instructorRepository.merge(instructor, body);
    return instructorRepository.save(instructor);
  };
  const deleteInstructor = async (id) => {
    if (!dbReady) {
      return demoStore.deleteInstructor(id);
    }
    const resultado = await instructorRepository.delete(id);
    return resultado.affected > 0;
  };

  const listEvaluaciones = async () => (dbReady ? evaluacionRepository.find() : demoStore.listEvaluaciones());
  const listEvaluacionesByAlumno = async (alumnoId) => (dbReady ? evaluacionRepository.find({ where: { alumnoId } }) : demoStore.listEvaluacionesByAlumno(alumnoId));
  const createEvaluacion = async (body) => {
    if (!dbReady) {
      return demoStore.createEvaluacion(body);
    }

    const alumnoId = parseInt(body.alumnoId);
    const instructorId = parseInt(body.instructorId);
    const alumno = await alumnoRepository.findOneBy({ id: alumnoId });
    const instructor = await instructorRepository.findOneBy({ id: instructorId });

    if (!alumno) {
      return null;
    }
    if (!instructor) {
      return null;
    }

    const resultadoEvaluacion = calcularResultadoEvaluacion({
      estacionamiento: body.estacionamiento,
      controlVehiculo: body.controlVehiculo,
      respetoSenales: body.respetoSenales,
    });

    const evaluacion = evaluacionRepository.create({
      ...body,
      alumnoId: alumno.id,
      instructorId: instructor.id,
      resultado: resultadoEvaluacion,
    });

    return evaluacionRepository.save(evaluacion);
  };
  const updateEvaluacion = async (id, body) => {
    if (!dbReady) {
      return demoStore.updateEvaluacion(id, body);
    }
    const evaluacion = await evaluacionRepository.findOneBy({ id });
    if (!evaluacion) {
      return null;
    }
    evaluacionRepository.merge(evaluacion, body);
    if (body.estacionamiento !== undefined || body.controlVehiculo !== undefined || body.respetoSenales !== undefined) {
      evaluacion.resultado = calcularResultadoEvaluacion({
        estacionamiento: body.estacionamiento ?? evaluacion.estacionamiento ?? '',
        controlVehiculo: body.controlVehiculo ?? evaluacion.controlVehiculo ?? '',
        respetoSenales: body.respetoSenales ?? evaluacion.respetoSenales ?? '',
      });
    }
    return evaluacionRepository.save(evaluacion);
  };
  const deleteEvaluacion = async (id) => {
    if (!dbReady) {
      return demoStore.deleteEvaluacion(id);
    }
    const resultado = await evaluacionRepository.delete(id);
    return resultado.affected > 0;
  };

  const aplicarCabeceras = (res, { contexto, accion, detalle }) => {
    res.setHeader('X-Contexto', contexto || 'Gestión de la escuela de conducción');
    res.setHeader('X-Accion', accion || 'Consulta de la API');
    res.setHeader('X-Detalle', detalle || 'La respuesta te ayuda a entender qué se está consultando');
  };

  app.get('/', async (req, res) => {
    aplicarCabeceras(res, {
      contexto: 'Inicio de la API de conducción',
      accion: 'Resumen general',
      detalle: 'Aquí puedes ver qué recursos ofrece la API y en qué modo está funcionando',
    });

    res.json({
      mensaje: 'API lista para gestionar la escuela de conducción',
      proposito: 'Sirve para registrar alumnos, instructores y evaluaciones prácticas.',
      recursos: ['/alumnos', '/instructores', '/evaluaciones-practicas', '/consultas'],
      modo: dbReady ? 'postgres' : 'demo',
      ayuda: 'Usa /consultas para ver un resumen completo y probar los requisitos de evaluación.',
    });
  });

  app.get('/consultas', async (req, res) => {
    try {
      aplicarCabeceras(res, {
        contexto: 'Gestión de la escuela de conducción',
        accion: 'Resumen completo de datos',
        detalle: 'Aquí se agrupan los alumnos, instructores y evaluaciones para probar los requisitos del sistema',
      });

      const [alumnos, instructores, evaluaciones] = await Promise.all([
        listAlumnos(),
        listInstructores(),
        listEvaluaciones(),
      ]);

      res.json({
        mensaje: 'Esta respuesta te sirve como guía para consultar y probar los requisitos del sistema.',
        datosCompletos: {
          alumnos,
          instructores,
          evaluaciones,
        },
        recursosDisponibles: [
          { ruta: '/alumnos', descripcion: 'Listado completo de alumnos registrados.' },
          { ruta: '/instructores', descripcion: 'Listado completo de instructores disponibles.' },
          { ruta: '/evaluaciones-practicas', descripcion: 'Listado completo de evaluaciones registradas.' },
          { ruta: '/alumnos/:id/evaluaciones', descripcion: 'Historial de evaluaciones de un alumno concreto.' },
        ],
        requisitosEvaluacion: [
          {
            nombre: 'estacionamiento',
            descripcion: 'Comprueba si el alumno puede estacionar correctamente.',
          },
          {
            nombre: 'controlVehiculo',
            descripcion: 'Evalúa el control que tiene sobre el vehículo.',
          },
          {
            nombre: 'respetoSenales',
            descripcion: 'Verifica si respeta las señales de tránsito.',
          },
        ],
        sugerenciasPrueba: [
          'Crea un alumno con POST /alumnos.',
          'Crea un instructor con POST /instructores.',
          'Registra una evaluación con POST /evaluaciones-practicas.',
          'Filtra resultados con GET /alumnos?nombre=Carlos, GET /instructores?rut=11111111-1 o GET /evaluaciones-practicas?resultado=aprobado.',
        ],
      });
    } catch (error) {
      res.status(500).json({ error: 'No se pudo construir la respuesta de consulta general' });
    }
  });

  registerAlumnoRoutes(app, {
    listAlumnos,
    getAlumnoPorId,
    createAlumno,
    updateAlumno,
    deleteAlumno,
  });

  registerInstructorRoutes(app, {
    listInstructores,
    getInstructorPorId,
    createInstructor,
    updateInstructor,
    deleteInstructor,
  });

  registerEvaluacionRoutes(app, {
    createEvaluacion,
    listEvaluaciones,
    listEvaluacionesByAlumno,
    getAlumnoPorId,
    updateEvaluacion,
    deleteEvaluacion,
    obtenerMensajeResultado,
  });

  app.listen(port, () => {
    console.log(`Backend corriendo en http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };