require('dotenv').config();
const { AppDataSource } = require('./config/db');
const { createDemoStore } = require('./demoStore');

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
      { nombre: 'Daniel', rut: '11111111-1', email: 'daniel@example.com', tipoLicencia: 'Clase B' },
      { nombre: 'Sofía', rut: '22222222-2', email: 'sofia@example.com', tipoLicencia: 'Clase A' },
    ]);
  }

  console.log('✅ Configuración completada con PostgreSQL');
  await AppDataSource.destroy();
}

async function main() {
  try {
    await seedDataWithPostgres();
  } catch (error) {
    createDemoStore();
    console.log('⚠️ No se pudo conectar a PostgreSQL. Se activó el modo demo para probar la API.');
    console.log('✅ Configuración completada (modo demo)');
  }
}

main();
