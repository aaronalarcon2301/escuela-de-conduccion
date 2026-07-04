const { AppDataSource } = require('../config/db');

const crearReserva = async (datos) => {
  const reservaRepository = AppDataSource.getRepository('Reserva');
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