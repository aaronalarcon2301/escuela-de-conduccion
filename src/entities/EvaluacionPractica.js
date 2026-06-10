const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'EvaluacionPractica',
  tableName: 'evaluaciones_practicas',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    alumnoId: {
      type: 'int',
    },
    instructorId: {
      type: 'int',
    },
    estacionamiento: {
      type: 'varchar',
    },
    controlVehiculo: {
      type: 'varchar',
    },
    respetoSenales: {
      type: 'varchar',
    },
    observaciones: {
      type: 'varchar',
      nullable: true,
    },
    resultado: {
      type: 'varchar',
    },
    fecha: {
      type: 'timestamp',
      createDate: true,
    },
  },
});
