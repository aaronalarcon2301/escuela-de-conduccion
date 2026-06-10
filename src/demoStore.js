const fs = require('fs');
const path = require('path');
const { calcularResultadoEvaluacion } = require('./utils/evaluacion');

const dataFilePath = path.join(__dirname, '..', 'data', 'demo-data.json');

// Este archivo guarda la información en un archivo local para que la API
// siga funcionando aunque no haya PostgreSQL activo.
function normalizeState(state) {
  const deduplicateByKey = (items, keySelector) => {
    const seen = new Set();
    return (items || []).filter((item) => {
      const key = keySelector(item);
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  return {
    alumnos: deduplicateByKey(state.alumnos || [], (item) => item.email ?? item.id),
    instructores: deduplicateByKey(state.instructores || [], (item) => item.rut ?? item.email ?? item.id),
    evaluaciones: deduplicateByKey(state.evaluaciones || [], (item) => item.id),
  };
}

function ensureDataFile() {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(dataFilePath)) {
    const initialState = {
      alumnos: [
        { id: 1, nombre: 'Carlos', email: 'carlos@example.com' },
        { id: 2, nombre: 'María', email: 'maria@example.com' },
      ],
      instructores: [
        { id: 1, nombre: 'Daniel', rut: '11111111-1', email: 'daniel@example.com', tipoLicencia: 'Clase B' },
        { id: 2, nombre: 'Sofía', rut: '22222222-2', email: 'sofia@example.com', tipoLicencia: 'Clase A' },
      ],
      evaluaciones: [],
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialState, null, 2));
    return initialState;
  }

  const loadedState = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  const normalizedState = normalizeState(loadedState);

  if (JSON.stringify(normalizedState) !== JSON.stringify(loadedState)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(normalizedState, null, 2));
  }

  return normalizedState;
}

function saveState(state) {
  ensureDataFile();
  fs.writeFileSync(dataFilePath, JSON.stringify(state, null, 2));
}

function createDemoStore() {
  const state = ensureDataFile();

  return {
    listAlumnos() {
      return state.alumnos;
    },
    getAlumnoById(id) {
      return state.alumnos.find((item) => item.id === id) || null;
    },
    createAlumno(data) {
      const nuevoAlumno = {
        id: state.alumnos.length > 0 ? Math.max(...state.alumnos.map((item) => item.id)) + 1 : 1,
        nombre: data.nombre || '',
        email: data.email || '',
      };
      state.alumnos.push(nuevoAlumno);
      saveState(state);
      return nuevoAlumno;
    },
    updateAlumno(id, data) {
      const alumno = this.getAlumnoById(id);
      if (!alumno) {
        return null;
      }
      Object.assign(alumno, data);
      saveState(state);
      return alumno;
    },
    deleteAlumno(id) {
      const index = state.alumnos.findIndex((item) => item.id === id);
      if (index === -1) {
        return false;
      }
      state.alumnos.splice(index, 1);
      saveState(state);
      return true;
    },
    listInstructores() {
      return state.instructores;
    },
    getInstructorById(id) {
      return state.instructores.find((item) => item.id === id) || null;
    },
    createInstructor(data) {
      const nuevoInstructor = {
        id: state.instructores.length > 0 ? Math.max(...state.instructores.map((item) => item.id)) + 1 : 1,
        nombre: data.nombre || '',
        rut: data.rut || '',
        email: data.email || '',
        tipoLicencia: data.tipoLicencia || '',
      };
      state.instructores.push(nuevoInstructor);
      saveState(state);
      return nuevoInstructor;
    },
    updateInstructor(id, data) {
      const instructor = this.getInstructorById(id);
      if (!instructor) {
        return null;
      }
      Object.assign(instructor, data);
      saveState(state);
      return instructor;
    },
    deleteInstructor(id) {
      const index = state.instructores.findIndex((item) => item.id === id);
      if (index === -1) {
        return false;
      }
      state.instructores.splice(index, 1);
      saveState(state);
      return true;
    },
    listEvaluaciones() {
      return state.evaluaciones;
    },
    listEvaluacionesByAlumno(alumnoId) {
      return state.evaluaciones.filter((item) => item.alumnoId === alumnoId);
    },
    createEvaluacion(data) {
      const alumno = this.getAlumnoById(data.alumnoId);
      const instructor = this.getInstructorById(data.instructorId);
      if (!alumno || !instructor) {
        throw new Error('Alumno o instructor no encontrado');
      }

      const nuevaEvaluacion = {
        id: state.evaluaciones.length > 0 ? Math.max(...state.evaluaciones.map((item) => item.id)) + 1 : 1,
        alumnoId: data.alumnoId,
        instructorId: data.instructorId,
        estacionamiento: data.estacionamiento || '',
        controlVehiculo: data.controlVehiculo || '',
        respetoSenales: data.respetoSenales || '',
        observaciones: data.observaciones || '',
        resultado: calcularResultadoEvaluacion(data),
        fecha: new Date().toISOString(),
      };
      state.evaluaciones.push(nuevaEvaluacion);
      saveState(state);
      return nuevaEvaluacion;
    },
    updateEvaluacion(id, data) {
      const evaluacion = state.evaluaciones.find((item) => item.id === id);
      if (!evaluacion) {
        return null;
      }
      Object.assign(evaluacion, data);
      if (data.estacionamiento !== undefined || data.controlVehiculo !== undefined || data.respetoSenales !== undefined) {
        evaluacion.resultado = calcularResultadoEvaluacion({
          estacionamiento: data.estacionamiento ?? evaluacion.estacionamiento ?? '',
          controlVehiculo: data.controlVehiculo ?? evaluacion.controlVehiculo ?? '',
          respetoSenales: data.respetoSenales ?? evaluacion.respetoSenales ?? '',
        });
      }
      saveState(state);
      return evaluacion;
    },
    deleteEvaluacion(id) {
      const index = state.evaluaciones.findIndex((item) => item.id === id);
      if (index === -1) {
        return false;
      }
      state.evaluaciones.splice(index, 1);
      saveState(state);
      return true;
    },
  };
}

module.exports = { createDemoStore };
