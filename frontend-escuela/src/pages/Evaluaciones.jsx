import { useState, useEffect } from 'react';

const CRITERIOS = [
  { key: 'estacionamiento', label: 'Estacionamiento' },
  { key: 'controlVehiculo', label: 'Control del vehículo' },
  { key: 'respetoSenales', label: 'Respeto de señales de tránsito' },
];

function Evaluaciones() {
  const [alumnos, setAlumnos] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [notificacion, setNotificacion] = useState(null); // { tipo: 'success' | 'danger', texto }

  const [form, setForm] = useState({
    alumnoId: '',
    instructorId: '',
    estacionamiento: 'Aprobado',
    controlVehiculo: 'Aprobado',
    respetoSenales: 'Aprobado',
    observaciones: '',
  });

  // Cargar alumnos e instructores para los selectores
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

  // Cargar historial cada vez que se selecciona un alumno
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
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrar la evaluación');
        return data;
      })
      .then(({ evaluacion, mensaje }) => {
        const aprobado = evaluacion.resultado === 'Aprobado';
        setNotificacion({ tipo: aprobado ? 'success' : 'warning', texto: mensaje });
        setHistorial([evaluacion, ...historial]);
        setForm({
          ...form,
          estacionamiento: 'Aprobado',
          controlVehiculo: 'Aprobado',
          respetoSenales: 'Aprobado',
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

      <div className="row">
        {/* Formulario */}
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
                      <option value="Aprobado">Aprobado</option>
                      <option value="Reforzamiento">Requiere reforzamiento</option>
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

        {/* Historial del alumno seleccionado */}
        <div className="col-md-7">
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
                        <td colSpan="6" className="text-center py-5 text-muted">
                          Selecciona un alumno para ver su historial.
                        </td>
                      </tr>
                    ) : historial.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          Este alumno aún no tiene evaluaciones registradas.
                        </td>
                      </tr>
                    ) : (
                      historial.map((ev) => (
                        <tr key={ev.id}>
                          <td>{new Date(ev.fecha).toLocaleDateString()}</td>
                          <td>{ev.estacionamiento}</td>
                          <td>{ev.controlVehiculo}</td>
                          <td>{ev.respetoSenales}</td>
                          <td>
                            <span className={`badge ${ev.resultado === 'Aprobado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {ev.resultado}
                            </span>
                          </td>
                          <td className="text-muted small">{ev.observaciones || '—'}</td>
                        </tr>
                      ))
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