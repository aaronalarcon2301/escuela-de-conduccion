import { useState, useEffect } from 'react';

const CRITERIOS = [
  { key: 'estacionamiento', label: 'Estacionamiento' },
  { key: 'controlVehiculo', label: 'Control del vehículo' },
  { key: 'respetoSenales', label: 'Respeto de señales de tránsito' },
];

const NIVELES = [
  { value: 'Excelente', label: 'Excelente (5/5)' },
  { value: 'Bueno', label: 'Bueno (4/5)' },
  { value: 'Regular', label: 'Regular (3/5)' },
  { value: 'Debe mejorar', label: 'Debe mejorar (2/5)' },
  { value: 'Deficiente', label: 'Deficiente (1/5)' },
];

const COLOR_POR_NIVEL = {
  'Excelente': 'bg-success',
  'Bueno': 'bg-primary',
  'Regular': 'bg-secondary',
  'Debe mejorar': 'bg-warning text-dark',
  'Deficiente': 'bg-danger',
};

const PUNTOS_POR_NIVEL = {
  'Excelente': 5,
  'Bueno': 4,
  'Regular': 3,
  'Debe mejorar': 2,
  'Deficiente': 1,
};

function Evaluaciones() {
  const [alumnos, setAlumnos] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [notificacion, setNotificacion] = useState(null); 

  const [form, setForm] = useState({
    alumnoId: '',
    instructorId: '',
    estacionamiento: 'Excelente',
    controlVehiculo: 'Excelente',
    respetoSenales: 'Excelente',
    observaciones: '',
  });

  useEffect(() => {
    fetch('http://localhost:3000/alumnos')
      .then((res) => res.json())
      .then(setAlumnos)
      .catch((err) => console.error('Error al cargar alumnos:', err));

    fetch('http://localhost:3000/instructores')
      .then((res) => res.json())
      .then(setInstructores)
      .catch((err) => console.error('Error al cargar instructores:', err));
  }, []);

  useEffect(() => {
    if (!form.alumnoId) {
      setHistorial([]);
      return;
    }
    fetch(`http://localhost:3000/evaluaciones-practicas/alumnos/${form.alumnoId}`)
      .then((res) => res.json())
      .then(setHistorial)
      .catch((err) => console.error('Error al cargar historial:', err));
  }, [form.alumnoId]);

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const alumnoSeleccionado = alumnos.find((a) => a.id === parseInt(form.alumnoId));
  const totalEvaluaciones = historial.length;
  const aprobadas = historial.filter((ev) => ev.resultado === 'Aprobado').length;
  const reforzamientos = totalEvaluaciones - aprobadas;
  const rendimiento = totalEvaluaciones > 0 ? Math.round((aprobadas / totalEvaluaciones) * 100) : 0;

  const ultimaEvaluacion = historial[0];
  const requiereReforzamiento = ultimaEvaluacion && ultimaEvaluacion.resultado !== 'Aprobado';
  const criteriosAReforzar = requiereReforzamiento
    ? CRITERIOS.filter((c) => ['Debe mejorar', 'Deficiente'].includes(ultimaEvaluacion[c.key])).map((c) => c.label)
    : [];
  const fechaProximaEvaluacion = (() => {
    if (!ultimaEvaluacion) return null;
    const base = new Date(ultimaEvaluacion.fecha);
    base.setDate(base.getDate() + 7);
    return base.toLocaleDateString();
  })();

  const manejarEnvio = (e) => {
    e.preventDefault();
    setNotificacion(null);

    fetch('http://localhost:3000/evaluaciones-practicas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        alumnoId: parseInt(form.alumnoId),
        instructorId: parseInt(form.instructorId),
      }),
    })
      .then(async (res) => {
        console.log("Status:", res.status);

       const texto = await res.text();
       console.log(texto);

       try {
         return JSON.parse(texto);
       } catch {
         throw new Error("El servidor respondió HTML en vez de JSON");
       }
     })
      .then(({ evaluacion, mensaje }) => {
        const aprobado = evaluacion.resultado === 'Aprobado';
        setNotificacion({ tipo: aprobado ? 'success' : 'warning', texto: mensaje });
        setHistorial([evaluacion, ...historial]);
        setForm({
          ...form,
          estacionamiento: 'Excelente',
          controlVehiculo: 'Excelente',
          respetoSenales: 'Excelente',
          observaciones: '',
        });
      })
      .catch((err) => {
        setNotificacion({ tipo: 'danger', texto: err.message });
      });
  };

  return (
    <div className="mt-4">
      <h2 className="mb-4">Registro de Evaluaciones Prácticas</h2>

      {notificacion && (
        <div className={`alert alert-${notificacion.tipo}`} role="alert">
          {notificacion.texto}
        </div>
      )}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h6 className="mb-3">ℹ️ ¿Cómo se evalúa?</h6>
          <p className="text-muted small mb-2">
            Cada criterio (estacionamiento, control del vehículo y respeto de señales) se califica en la siguiente escala:
          </p>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {NIVELES.map((nivel) => (
              <span key={nivel.value} className={`badge ${COLOR_POR_NIVEL[nivel.value]}`}>
                {nivel.value} ({PUNTOS_POR_NIVEL[nivel.value]}/5)
              </span>
            ))}
          </div>
          <p className="text-muted small mb-1">
            <strong>Resultado final:</strong> el sistema calcula automáticamente el promedio de los 3 criterios.
          </p>
          <ul className="text-muted small mb-0 ps-3">
            <li>Si el promedio es <strong>60% o más</strong>, el alumno queda <span className="text-success fw-bold">Aprobado</span>.</li>
            <li>Si algún criterio queda calificado como <strong>Deficiente</strong>, el alumno <span className="text-danger fw-bold">requiere reforzamiento</span> automáticamente, sin importar el promedio.</li>
            <li>En cualquier otro caso, el alumno <span className="text-warning fw-bold">requiere reforzamiento</span>.</li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Nueva evaluación</h5>
            </div>
            <div className="card-body">
              <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Alumno</label>
                  <select
                    className="form-select"
                    name="alumnoId"
                    value={form.alumnoId}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Selecciona un alumno</option>
                    {alumnos.map((alumno) => (
                      <option key={alumno.id} value={alumno.id}>
                        {alumno.nombre} {alumno.apellido || ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Instructor</label>
                  <select
                    className="form-select"
                    name="instructorId"
                    value={form.instructorId}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Selecciona un instructor</option>
                    {instructores.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <hr />
                <p className="text-muted small fw-bold mb-2">Criterios de evaluación</p>

                {CRITERIOS.map(({ key, label }) => (
                  <div className="mb-3" key={key}>
                    <label className="form-label small">{label}</label>
                    <select
                      className="form-select"
                      name={key}
                      value={form[key]}
                      onChange={manejarCambio}
                      required
                    >
                      {NIVELES.map((nivel) => (
                        <option key={nivel.value} value={nivel.value}>{nivel.label}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">Observaciones (opcional)</label>
                  <textarea
                    className="form-control"
                    name="observaciones"
                    rows="2"
                    value={form.observaciones}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Registrar evaluación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          {form.alumnoId && (
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <h5 className="mb-3">{alumnoSeleccionado ? `${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido || ''}` : 'Alumno'}</h5>
                <div className="row text-center">
                  <div className="col">
                    <div className="fs-4 fw-bold">{totalEvaluaciones}</div>
                    <div className="text-muted small">Evaluaciones</div>
                  </div>
                  <div className="col">
                    <div className="fs-4 fw-bold text-success">{aprobadas} ✅</div>
                    <div className="text-muted small">Aprobadas</div>
                  </div>
                  <div className="col">
                    <div className="fs-4 fw-bold text-warning">{reforzamientos} ⚠️</div>
                    <div className="text-muted small">Reforzamiento</div>
                  </div>
                  <div className="col">
                    <div className="fs-4 fw-bold">{rendimiento}%</div>
                    <div className="text-muted small">Rendimiento</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {requiereReforzamiento && (
            <div className="card shadow-sm border-0 mb-3 border-start border-4 border-warning">
              <div className="card-body">
                <h6 className="mb-2">📅 Próxima práctica recomendada</h6>
                <div className="mb-1"><strong>{fechaProximaEvaluacion}</strong></div>
                <div className="text-muted small">
                  Motivo: {criteriosAReforzar.length > 0 ? `Mejorar ${criteriosAReforzar.join(', ').toLowerCase()}` : 'Repasar los criterios evaluados'}
                </div>
              </div>
            </div>
          )}

          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Historial del alumno</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Fecha</th>
                      <th>Instructor</th>
                      <th>Estacionamiento</th>
                      <th>Control vehículo</th>
                      <th>Señales</th>
                      <th>Resultado</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!form.alumnoId ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          Selecciona un alumno para ver su historial.
                        </td>
                      </tr>
                    ) : historial.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          Este alumno aún no tiene evaluaciones registradas.
                        </td>
                      </tr>
                    ) : (
                      historial.map((ev) => {
                        const instructorEvaluacion = instructores.find((i) => i.id === ev.instructorId);
                        return (
                        <tr key={ev.id}>
                          <td>{new Date(ev.fecha).toLocaleDateString()}</td>
                          <td>{instructorEvaluacion ? instructorEvaluacion.nombre : '—'}</td>
                          <td><span className={`badge ${COLOR_POR_NIVEL[ev.estacionamiento] || 'bg-secondary'}`}>{ev.estacionamiento} ({PUNTOS_POR_NIVEL[ev.estacionamiento] || '?'}/5)</span></td>
                          <td><span className={`badge ${COLOR_POR_NIVEL[ev.controlVehiculo] || 'bg-secondary'}`}>{ev.controlVehiculo} ({PUNTOS_POR_NIVEL[ev.controlVehiculo] || '?'}/5)</span></td>
                          <td><span className={`badge ${COLOR_POR_NIVEL[ev.respetoSenales] || 'bg-secondary'}`}>{ev.respetoSenales} ({PUNTOS_POR_NIVEL[ev.respetoSenales] || '?'}/5)</span></td>
                          <td>
                            <span className={`badge ${ev.resultado === 'Aprobado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {ev.resultado}
                            </span>
                          </td>
                          <td className="text-muted small">{ev.observaciones || '—'}</td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Evaluaciones;