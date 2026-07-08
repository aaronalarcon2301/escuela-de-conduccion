const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Usuario',
  tableName: 'usuarios',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombre: { type: 'varchar', nullable: true },
    email: { type: 'varchar', unique: true },
    password: { type: 'varchar' },
    rol: { type: 'varchar', default: 'admin' }
  }
});
