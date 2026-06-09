const { EntitySchema } = require('typeorm');

// estructura del instructor para la B.D
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
      length: 100,
    },
    rut: {
      type: 'varchar',
      length: 12,
      unique: true, // Evita que se registren dos instructores con el mismo RUT
    }
  }
});