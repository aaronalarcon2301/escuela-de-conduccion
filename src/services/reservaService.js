const { AppDataSource } = require('../config/db');
const { Between } = require('typeorm'); // Importamos Between para calcular el rango del día

const crearReserva = async (datos) => {
  const { alumnoId, instructorId, fecha_hora } = datos;
  
  const claseRepository = AppDataSource.getRepository('Clase');
  const instructorRepository = AppDataSource.getRepository('Instructor');
  const alumnoRepository = AppDataSource.getRepository('Alumno');

  // Verifica que el alumno exista y tenga sus pagos al día
  const alumno = await alumnoRepository.findOneBy({ id: alumnoId });
  if (!alumno) return { error: 'Alumno no encontrado', codigo: 404 };
  if (alumno.pagos_al_dia === false) return { error: 'Operación denegada: El alumno mantiene deudas pendientes.', codigo: 403 };

  // Verifica que el instructor exista en el sistema
  const instructor = await instructorRepository.findOneBy({ id: instructorId });
  if (!instructor) return { error: 'Instructor no encontrado en el sistema.', codigo: 404 };

  const fechaSolicitada = new Date(fecha_hora);
  const inicioDia = new Date(fechaSolicitada.setHours(0,0,0,0));
  const finDia = new Date(fechaSolicitada.setHours(23,59,59,999));
  const fechaOriginal = new Date(fecha_hora);

  // El alumno no debe tener otra clase el mismo dia
  const claseMismoDiaAlumno = await claseRepository.findOne({
    where: {
      alumno: { id: alumnoId },
      fecha_hora: Between(inicioDia, finDia)
    }
  });
  if (claseMismoDiaAlumno) return { error: 'El alumno ya tiene una clase agendada para este día.', codigo: 400 };

  // El horario debe estar disponible en la agenda del instructor
  const choqueHorarioInstructor = await claseRepository.findOne({
    where: {
      instructor: { id: instructorId },
      fecha_hora: fechaOriginal
    }
  });
  if (choqueHorarioInstructor) return { error: 'El horario ya se encuentra bloqueado para este instructor.', codigo: 400 };

  const nuevaClase = claseRepository.create({
    tipo: 'Práctica',
    fecha_hora: fechaOriginal,
    estado: 'Programada',
    alumno: alumno,
    instructor: instructor
  });
  
  const claseGuardada = await claseRepository.save(nuevaClase);

  console.log(`SIMULACIÓN EMAIL: Correo de confirmación enviado exitosamente a ${alumno.email}`);

  return { exito: true, reserva: claseGuardada };
};

module.exports = {
  crearReserva
};