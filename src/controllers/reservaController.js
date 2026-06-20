const reservaService = require('../services/reservaService');

const reservarClase = async (req, res) => {
  try {
    const resultado = await reservaService.crearReserva(req.body);

    if (resultado.error) {
      return res.status(resultado.codigo).json({ error: resultado.error });
    }

    res.status(201).json({
      mensaje: 'Clase agendada y horario bloqueado con éxito',
      reserva: resultado.reserva
    });

  } catch (error) {
    console.error('Error interno al procesar la reserva:', error);
    res.status(500).json({ error: 'Error interno al procesar la reserva' });
  }
};

module.exports = {
  reservarClase
};