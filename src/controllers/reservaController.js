const { AppDataSource } = require('../config/db');
const { Between } = require('typeorm'); // Importamos Between para calcular el rango del día

const claseRepository = AppDataSource.getRepository('Clase');
const instructorRepository = AppDataSource.getRepository('Instructor');
const alumnoRepository = AppDataSource.getRepository('Alumno');

// Agenda una clase práctica con sus validaciones
const reservarClase = async (req, res) => {
  try {
    const { alumnoId, instructorId, fecha_hora } = req.body;
    
    // Verifica que el alumno exista y tenga sus pagos al día
    const alumno = await alumnoRepository.findOneBy({ id: alumnoId });
    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    if (alumno.pagos_al_dia === false) {
      return res.status(403).json({ error: 'Operación denegada: El alumno mantiene deudas pendientes.' });
    }

    // Verifica que el instructor exista en el sistema
    const instructor = await instructorRepository.findOneBy({ id: instructorId });
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor no encontrado en el sistema.' });
    }

    const fechaSolicitada = new Date(fecha_hora);
    const inicioDia = new Date(fechaSolicitada.setHours(0,0,0,0));
    const finDia = new Date(fechaSolicitada.setHours(23,59,59,999));

    const fechaOriginal = new Date(fecha_hora);

    // El alumno no debe tener otra clase el mismo dia
    const claseMismoDiaAlumno = await claseRepository.findOne({
      where: {
        alumno: { id: alumnoId }, // <-- Filtra por este alumno en específico
        fecha_hora: Between(inicioDia, finDia) // <-- Busca entre las 00:00 y las 23:59 de ese día
      }
    });

    if (claseMismoDiaAlumno) {
      return res.status(400).json({ error: 'El alumno ya tiene una clase agendada para este día.' });
    }

    // El horario debe estar disponible en la agenda del instructor
    const choqueHorarioInstructor = await claseRepository.findOne({
      where: {
        instructor: { id: instructorId }, // <-- Filtra por este instructor en específico
        fecha_hora: fechaOriginal
      }
    });

    if (choqueHorarioInstructor) {
      return res.status(400).json({ error: 'El horario ya se encuentra bloqueado para este instructor.' });
    }

    // Guarda la clase (bloquea el horario y vincula las relaciones)
    const nuevaClase = claseRepository.create({
      tipo: 'Práctica',
      fecha_hora: fechaOriginal,
      estado: 'Programada',
      alumno: alumno,         // <-- Conecta la entidad Alumno a esta clase
      instructor: instructor  // <-- Conecta la entidad Instructor a esta clase
    });
    
    const claseGuardada = await claseRepository.save(nuevaClase);

    console.log(`SIMULACIÓN EMAIL: Correo de confirmación enviado exitosamente a ${alumno.email}`);

    res.status(201).json({
      mensaje: 'Clase agendada y horario bloqueado con éxito',
      reserva: claseGuardada
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al procesar la reserva' });
  }
};

module.exports = {
  reservarClase
};