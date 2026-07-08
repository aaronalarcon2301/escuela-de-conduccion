const reservaService = require('../services/reservaService');

const crearReserva = async (req, res) => {
  try {
    const resultado = await reservaService.crearReserva(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerReservas = async (req, res) => {
  try {
    const reservas = await reservaService.obtenerReservas();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

const actualizarReserva = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await reservaService.actualizarReserva(id, req.body);
    if (!resultado) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

const eliminarReserva = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = await reservaService.eliminarReserva(id);
    if (!eliminado) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json({ mensaje: 'Reserva eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

module.exports = { crearReserva, obtenerReservas, actualizarReserva, eliminarReserva };