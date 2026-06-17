const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Instructor',
  tableName: 'instructores',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombre: { type: 'varchar', length: 100 },
    rut: { type: 'varchar', length: 12, unique: true }
  }
});