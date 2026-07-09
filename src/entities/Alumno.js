const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Alumno',
  tableName: 'alumnos',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombre: { type: 'varchar' },
    apellido: { type: 'varchar', nullable: true },          
    rut: { type: 'varchar', unique: true, nullable: true }, 
    email: { type: 'varchar', unique: true },
    telefono: { type: 'varchar', unique: true, nullable: true }, 
    pagos_al_dia: { type: 'boolean', default: true }  
  }
});