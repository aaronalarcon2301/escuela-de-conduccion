const { AppDataSource } = require('../config/db');
const emailService = require('./emailService');

const crearReserva = async (datos) => {
  const reservaRepository = AppDataSource.getRepository('Reserva');
  const alumnoRepository = AppDataSource.getRepository('Alumno');

  const alumno = await alumnoRepository.findOneBy({ id: datos.alumnoId });

  if (!alumno) {
    throw new Error('El alumno seleccionado no existe.');
  }

  if (alumno.pagos_al_dia === false) {
    throw new Error('Bloqueo de agendamiento: El alumno registra mensualidades pendientes.');
  }

  const choqueInstructor = await reservaRepository.findOne({
    where: {
      fecha: datos.fecha,
      hora: datos.hora,
      instructor: { id: datos.instructorId }
    }
  });

  if (choqueInstructor) {
    throw new Error('Cruce de horarios: El instructor ya tiene una clase agendada en ese horario.');
  }

  const choqueAlumno = await reservaRepository.findOne({
    where: {
      fecha: datos.fecha,
      hora: datos.hora,
      alumno: { id: datos.alumnoId }
    }
  });

  if (choqueAlumno) {
    throw new Error('Cruce de horarios: El alumno ya tiene una clase agendada en ese horario.');
  }

  const nuevaReserva = reservaRepository.create({
    fecha: datos.fecha,
    hora: datos.hora,
    estado: datos.estado,
    alumno: { id: datos.alumnoId },
    instructor: { id: datos.instructorId }
  });

  const reservaGuardada = await reservaRepository.save(nuevaReserva);

  emailService.enviarCorreoConfirmacion(alumno.email, alumno.nombre, datos.fecha, datos.hora);

  return reservaGuardada;
};

const obtenerReservas = async () => {
  const reservaRepository = AppDataSource.getRepository('Reserva');
  return await reservaRepository.find({
    order: { fecha: 'ASC', hora: 'ASC' } 
  });
};

const actualizarReserva = async (id, datos) => {
  const reservaRepository = AppDataSource.getRepository('Reserva');
  const reserva = await reservaRepository.findOneBy({ id: id });
  
  if (!reserva) return null;

  reservaRepository.merge(reserva, {
    fecha: datos.fecha,
    hora: datos.hora,
    estado: datos.estado,
    alumno: { id: datos.alumnoId },
    instructor: { id: datos.instructorId }
  });
  
  return await reservaRepository.save(reserva);
};

const eliminarReserva = async (id) => {
  const reservaRepository = AppDataSource.getRepository('Reserva');
  const resultado = await reservaRepository.delete(id);
  return resultado.affected > 0;
};

module.exports = { crearReserva, obtenerReservas, actualizarReserva, eliminarReserva };