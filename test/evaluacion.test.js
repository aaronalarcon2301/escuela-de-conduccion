const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calcularResultadoEvaluacion,
  obtenerMensajeResultado,
} = require('../src/utils/evaluacion');

test('calcula resultado aprobado cuando los tres criterios son aprobados', () => {
  const resultado = calcularResultadoEvaluacion({
    estacionamiento: 'Aprobado',
    controlVehiculo: 'Aprobado',
    respetoSenales: 'Aprobado',
  });

  assert.equal(resultado, 'Aprobado');
});

test('calcula resultado de reforzamiento cuando alguno de los criterios no está aprobado', () => {
  const resultado = calcularResultadoEvaluacion({
    estacionamiento: 'Aprobado',
    controlVehiculo: 'Reforzamiento',
    respetoSenales: 'Aprobado',
  });

  assert.equal(resultado, 'Requiere reforzamiento');
});

test('genera el mensaje de resultado correcto', () => {
  assert.equal(obtenerMensajeResultado('Aprobado'), 'Evaluación registrada correctamente. Alumno aprobado.');
  assert.equal(obtenerMensajeResultado('Requiere reforzamiento'), 'Evaluación registrada correctamente. El alumno requiere reforzamiento.');
});
