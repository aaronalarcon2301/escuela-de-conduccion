const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Clase', // Nombre de la entidad en el codigo
  tableName: 'clases', // Nombre de la tabla en el postgresql
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true, 
    },
    tipo: {
      type: 'varchar', 
      length: 50,
    },
    fecha_hora: {
      type: 'timestamp', // cuando se realiza la clase
    },
    estado: {
      type: 'varchar',
      length: 20,
      default: 'Programada', // Puede ser programada, completada o cancelada
    }
  },
  // Bloque de relaciones 
  relations: {
    alumno: {
      target: 'Alumno', // Entidad destino
      type: 'many-to-one', // Relación de muchos a uno (Varias clases -> Un alumno)
      joinColumn: { name: 'alumno_id' },
    },
    instructor: {
      target: 'Instructor', // Entidad destino
      type: 'many-to-one', // Relación de muchos a uno (Varias clases -> Un instructor)
      joinColumn: { name: 'instructor_id' }, 
    }
  }
});