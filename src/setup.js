require('dotenv').config();
const { AppDataSource } = require('./config/db');

async function seedDataWithPostgres() {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);

  const alumnoRepository = AppDataSource.getRepository('Alumno');
  const instructorRepository = AppDataSource.getRepository('Instructor');

  const alumnosExistentes = await alumnoRepository.count();
  if (alumnosExistentes === 0) {
    await alumnoRepository.save([
      { nombre: 'Carlos', email: 'carlos@example.com' },
      { nombre: 'María', email: 'maria@example.com' },
    ]);
  }

  const instructoresExistentes = await instructorRepository.count();
  if (instructoresExistentes === 0) {
    await instructorRepository.save([
      { nombre: 'Daniel', apellido: 'Pérez', rut: '11111111-1', email: 'daniel@example.com', licencia: 'Clase B' },
      { nombre: 'Sofía', apellido: 'González', rut: '22222222-2', email: 'sofia@example.com', licencia: 'Clase A' },
    ]);
  }

  console.log('✅ Configuración completada con PostgreSQL');
  await AppDataSource.destroy();
}

async function main() {
  try {
    await seedDataWithPostgres();
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error.message);
  }
}

main();