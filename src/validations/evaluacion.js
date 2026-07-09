const PUNTOS_POR_NIVEL = {
  'Excelente': 5,
  'Bueno': 4,
  'Regular': 3,
  'Debe mejorar': 2,
  'Deficiente': 1,
};

function calcularResultadoEvaluacion({ estacionamiento, controlVehiculo, respetoSenales }) {
  const niveles = [estacionamiento, controlVehiculo, respetoSenales].map((n) => String(n || '').trim());


  const tieneFaltaGrave = niveles.some((nivel) => nivel === 'Deficiente');

  const puntos = niveles.map((nivel) => PUNTOS_POR_NIVEL[nivel] || 0);
  const promedio = puntos.reduce((suma, p) => suma + p, 0) / puntos.length;
  const porcentaje = Math.round((promedio / 5) * 100);

  const resultado = (!tieneFaltaGrave && porcentaje >= 60) ? 'Aprobado' : 'Requiere reforzamiento';

  return { resultado, porcentaje };
}

function obtenerMensajeResultado(resultado, porcentaje) {
  return resultado === 'Aprobado'
    ? `Evaluación registrada correctamente. Alumno aprobado (${porcentaje}% de rendimiento).`
    : `Evaluación registrada correctamente. El alumno requiere reforzamiento (${porcentaje}% de rendimiento).`;
}

module.exports = {
  calcularResultadoEvaluacion,
  obtenerMensajeResultado,
  PUNTOS_POR_NIVEL,
};