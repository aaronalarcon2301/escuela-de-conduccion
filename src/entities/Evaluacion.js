const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Evaluacion',
  tableName: 'evaluaciones',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    fecha: { type: 'date' },
    tipo: { type: 'varchar', default: 'Práctica' }, // Teórica o Práctica
    resultado: { type: 'varchar', default: 'Pendiente' }, // Aprobado, Reprobado, Pendiente
    comentarios: { type: 'text', nullable: true }
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