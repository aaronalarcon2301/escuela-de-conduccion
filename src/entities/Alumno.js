const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Alumno', // Nombre entidad
  tableName: 'alumnos', // Nombre de la tabla
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
      unique: true, // No pueden haber dos alumnos con el mismo correo
    },
  },
});