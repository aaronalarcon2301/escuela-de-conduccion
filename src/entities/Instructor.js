const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Instructor',
  tableName: 'instructores',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: {
      type: 'varchar',
    },
    rut: {
      type: 'varchar',
      unique: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    tipoLicencia: {
      type: 'varchar',
    },
  },
});
