const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Reserva',
  tableName: 'reservas',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    fecha: { type: 'date' },
    hora: { type: 'varchar' }, 
    estado: { type: 'varchar', default: 'Programada' } // Puede ser: Programada, Completada, Cancelada
  },
  relations: {
    alumno: {
      target: 'Alumno',
      type: 'many-to-one',
      joinColumn: { name: 'alumno_id' },
      onDelete: 'CASCADE', 
      eager: true
    },
    instructor: {
      target: 'Instructor',
      type: 'many-to-one',
      joinColumn: { name: 'instructor_id' },
      onDelete: 'CASCADE', 
      eager: true
    }
  }
});