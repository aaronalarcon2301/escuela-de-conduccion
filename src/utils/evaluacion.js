function calcularResultadoEvaluacion({ estacionamiento, controlVehiculo, respetoSenales }) {
  const resultado = (
    String(estacionamiento || '').trim().toLowerCase() === 'aprobado' &&
    String(controlVehiculo || '').trim().toLowerCase() === 'aprobado' &&
    String(respetoSenales || '').trim().toLowerCase() === 'aprobado'
  )
    ? 'Aprobado'
    : 'Requiere reforzamiento';

  return resultado;
}

function obtenerMensajeResultado(resultado) {
  return resultado === 'Aprobado'
    ? 'Evaluación registrada correctamente. Alumno aprobado.'
    : 'Evaluación registrada correctamente. El alumno requiere reforzamiento.';
}

module.exports = {
  calcularResultadoEvaluacion,
  obtenerMensajeResultado,
};
