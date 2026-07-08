const { AppDataSource } = require('../config/db');

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

  const nuevaReserva = reservaRepository.create(datos);
  return await reservaRepository.save(nuevaReserva);
};

const obtenerReservas = async () => {
  const reservaRepository = AppDataSource.getRepository('Reserva');
  return await reservaRepository.find({
    order: { fecha: 'ASC', hora: 'ASC' } // Las ordenamos por fecha y hora
  });
};

const actualizarReserva = async (id, datos) => {
  const reservaRepository = AppDataSource.getRepository('Reserva');
  const reserva = await reservaRepository.findOneBy({ id: id });
  
  if (!reserva) return null;

  reservaRepository.merge(reserva, datos);
  return await reservaRepository.save(reserva);
};

const eliminarReserva = async (id) => {
  const reservaRepository = AppDataSource.getRepository('Reserva');
  const resultado = await reservaRepository.delete(id);
  return resultado.affected > 0;
};

module.exports = { crearReserva, obtenerReservas, actualizarReserva, eliminarReserva };