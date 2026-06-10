const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Alumno', // Nombre de la entidad
  tableName: 'alumnos', // Nombre real de la tabla en la base de datos
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true, // enumera solo: 1, 2, 3...
    },
    nombre: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
      unique: true, // No se puede repetir el correo para dos alumnos distintos
    },
  },
});