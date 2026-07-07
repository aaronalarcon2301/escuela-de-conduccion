import { useState, useEffect } from 'react';

function Evaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [instructores, setInstructores] = useState([]);
  
  const [nuevaEvaluacion, setNuevaEvaluacion] = useState({
    alumno: '',
    instructor: '',
    fecha: '',
    tipo: 'Práctica',
    resultado: 'Pendiente',
    comentarios: ''
  });
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  const cargarEvaluaciones = () => {
    fetch('http://localhost:3000/evaluaciones')
      .then(res => res.json())
      .then(datos => setEvaluaciones(datos))
      .catch(err => console.error('Error al cargar evaluaciones:', err));
  };

  useEffect(() => {
    // 1. Cargar Evaluaciones
    fetch('http://localhost:3000/evaluaciones')
      .then(res => {
        if (!res.ok) throw new Error('Error al conectar con evaluaciones');
        return res.json();
      })
      .then(datos => setEvaluaciones(datos))
      .catch(err => console.error('Error al cargar evaluaciones:', err));

    // 2. Cargar Alumnos
    fetch('http://localhost:3000/alumnos')
      .then(res => res.json())
      .then(datos => setAlumnos(datos))
      .catch(err => console.error('Error al cargar alumnos:', err));

    // 3. Cargar Instructores
    fetch('http://localhost:3000/instructores')
      .then(res => res.json())
      .then(datos => setInstructores(datos))
      .catch(err => console.error('Error al cargar instructores:', err));
  }, []);

  const manejarCambio = (e) => {
    setNuevaEvaluacion({
      ...nuevaEvaluacion,
      [e.target.name]: e.target.value
    });
  };

  const manejarEditar = (evaluacion) => {
    const fechaLimpia = evaluacion.fecha ? evaluacion.fecha.split('T')[0] : '';
    
    setNuevaEvaluacion({
      alumno: evaluacion.alumno.id,
      instructor: evaluacion.instructor.id,
      fecha: fechaLimpia,
      tipo: evaluacion.tipo,
      resultado: evaluacion.resultado,
      comentarios: evaluacion.comentarios || ''
    });
    setModoEdicion(true);
    setIdEdicion(evaluacion.id);
  };

  const cancelarEdicion = () => {
    setNuevaEvaluacion({ alumno: '', instructor: '', fecha: '', tipo: 'Práctica', resultado: 'Pendiente', comentarios: '' });
    setModoEdicion(false);
    setIdEdicion(null);
  };

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    
    const url = modoEdicion ? `http://localhost:3000/evaluaciones/${idEdicion}` : 'http://localhost:3000/evaluaciones';
    const metodo = modoEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaEvaluacion)
    })
    .then(() => {
      cargarEvaluaciones();
      cancelarEdicion();
    })
    .catch(err => console.error('Error al guardar:', err));
  };

  const manejarEliminar = (id) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este registro de evaluación?');
    if (confirmar) {
      fetch(`http://localhost:3000/evaluaciones/${id}`, {
        method: 'DELETE',
      })
      .then(() => {
        const nuevaLista = evaluaciones.filter(ev => ev.id !== id);
        setEvaluaciones(nuevaLista);
      })
      .catch(err => console.error('Error al eliminar:', err));
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Historial de Evaluaciones</h2>
      </div>
      
      <div className="row">
        {/* Formulario */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className={`card-header ${modoEdicion ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
              <h5 className="mb-0 fw-bold">{modoEdicion ? '✏️ Editar Evaluación' : '📝 Registrar Evaluación'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={manejarEnvio}>
                
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Alumno Evaluado</label>
                  <select className="form-select" name="alumno" value={nuevaEvaluacion.alumno} onChange={manejarCambio} required>
                    <option value="">Seleccione un alumno...</option>
                    {alumnos.map(al => (
                      <option key={al.id} value={al.id}>{al.nombre} {al.apellido}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Instructor Evaluador</label>
                  <select className="form-select" name="instructor" value={nuevaEvaluacion.instructor} onChange={manejarCambio} required>
                    <option value="">Seleccione un instructor...</option>
                    {instructores.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.nombre} {inst.apellido}</option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Fecha</label>
                    <input type="date" className="form-control" name="fecha" value={nuevaEvaluacion.fecha} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Tipo</label>
                    <select className="form-select" name="tipo" value={nuevaEvaluacion.tipo} onChange={manejarCambio}>
                      <option value="Práctica">Práctica</option>
                      <option value="Teórica">Teórica</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Resultado Final</label>
                  <select className="form-select fw-bold" name="resultado" value={nuevaEvaluacion.resultado} onChange={manejarCambio}>
                    <option value="Pendiente">⏳ Pendiente</option>
                    <option value="Aprobado">✅ Aprobado</option>
                    <option value="Reprobado">❌ Reprobado</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">Observaciones del Instructor</label>
                  <textarea 
                    className="form-control" 
                    name="comentarios" 
                    rows="3" 
                    placeholder="Ej: Faltó usar los intermitentes en la rotonda..."
                    value={nuevaEvaluacion.comentarios} 
                    onChange={manejarCambio}
                  ></textarea>
                </div>
                
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${modoEdicion ? 'btn-success' : 'btn-warning text-dark fw-bold'}`}>
                    {modoEdicion ? 'Actualizar Registro' : 'Guardar Evaluación'}
                  </button>
                  {modoEdicion && (
                    <button type="button" className="btn btn-light border" onClick={cancelarEdicion}>Cancelar</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Fecha</th>
                      <th>Alumno</th>
                      <th>Evaluador</th>
                      <th>Tipo</th>
                      <th>Resultado</th>
                      <th className="text-center pe-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluaciones.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-5 text-muted">No hay evaluaciones registradas.</td></tr>
                    ) : (
                      evaluaciones.map((ev) => {
                        const fechaVisual = ev.fecha ? ev.fecha.split('T')[0] : '';
                        return (
                          <tr key={ev.id}>
                            <td className="ps-4 fw-medium text-dark">{fechaVisual}</td>
                            <td>
                              <div className="fw-bold">{ev.alumno ? `${ev.alumno.nombre} ${ev.alumno.apellido}` : '⚠️ Borrado'}</div>
                            </td>
                            <td className="small text-muted">
                              {ev.instructor ? `${ev.instructor.nombre} ${ev.instructor.apellido}` : '⚠️ Borrado'}
                            </td>
                            <td>
                              <span className={`badge ${ev.tipo === 'Teórica' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                                {ev.tipo}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${
                                ev.resultado === 'Aprobado' ? 'bg-success' : 
                                ev.resultado === 'Reprobado' ? 'bg-danger' : 
                                'bg-warning text-dark'
                              }`}>
                                {ev.resultado}
                              </span>
                            </td>
                            <td className="text-center pe-4">
                              <div className="d-flex justify-content-center gap-2">
                                <button onClick={() => manejarEditar(ev)} className="btn btn-sm btn-outline-primary px-3" style={{ borderRadius: '20px' }}>✏️</button>
                                <button onClick={() => manejarEliminar(ev.id)} className="btn btn-sm btn-outline-danger px-3" style={{ borderRadius: '20px' }}>🗑️</button>
                              </div>
                            </td>
                          </tr>
                        )
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