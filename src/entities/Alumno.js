const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Alumno',
  tableName: 'alumnos',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombre: { type: 'varchar' },
    email: { type: 'varchar', unique: true },
    pagos_al_dia: { type: 'boolean', default: true }  
  }
});