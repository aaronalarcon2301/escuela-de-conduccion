const { AppDataSource } = require('../config/db');
const { Between } = require('typeorm');

const crearReserva = async (datos) => {
  const { alumnoId, instructorId, fecha_hora } = datos;
  
  const claseRepository = AppDataSource.getRepository('Clase');
  const instructorRepository = AppDataSource.getRepository('Instructor');
  const alumnoRepository = AppDataSource.getRepository('Alumno');

  // REQUISITO: Validar que el alumno mantenga sus pagos al día
  const alumno = await alumnoRepository.findOneBy({ id: alumnoId });
  if (!alumno) return { error: 'Alumno no encontrado', codigo: 404 };
  if (alumno.pagos_al_dia === false) {
    return { error: 'Operación denegada: El alumno no mantiene sus pagos al día.', codigo: 403 };
  }

  const instructor = await instructorRepository.findOneBy({ id: instructorId });
  if (!instructor) return { error: 'Instructor no encontrado en el sistema.', codigo: 404 };

  const fechaSolicitada = new Date(fecha_hora);
  const inicioDia = new Date(fechaSolicitada.setHours(0,0,0,0));
  const finDia = new Date(fechaSolicitada.setHours(23,59,59,999));
  const fechaOriginal = new Date(fecha_hora);

  // REQUISITO: Validar que no tenga otra clase agendada para la misma fecha
  const claseMismoDiaAlumno = await claseRepository.findOne({
    where: {
      alumno: { id: alumnoId },
      fecha_hora: Between(inicioDia, finDia)
    }
  });
  if (claseMismoDiaAlumno) {
    return { error: 'Operación denegada: El alumno ya tiene una clase agendada para esta misma fecha.', codigo: 400 };
  }

  // REQUISITO: Verificación automática de disponibilidad en un bloque de horario
  const choqueHorarioInstructor = await claseRepository.findOne({
    where: {
      instructor: { id: instructorId },
      fecha_hora: fechaOriginal
    }
  });
  if (choqueHorarioInstructor) {
    return { error: 'Operación denegada: El bloque de horario no se encuentra disponible en la agenda del instructor.', codigo: 400 };
  }

  // REQUISITO: El sistema bloqueará el horario en la agenda del instructor
  const nuevaClase = claseRepository.create({
    tipo: 'Práctica',
    fecha_hora: fechaOriginal,
    estado: 'Programada',
    alumno: alumno,
    instructor: instructor
  });
  
  const claseGuardada = await claseRepository.save(nuevaClase);

  // REQUISITO: El sistema enviará un correo electrónico de confirmación
  console.log(`SIMULACIÓN EMAIL: Correo electrónico de confirmación enviado exitosamente a ${alumno.email}`);

  return { exito: true, reserva: claseGuardada };
};

module.exports = {
  crearReserva
};