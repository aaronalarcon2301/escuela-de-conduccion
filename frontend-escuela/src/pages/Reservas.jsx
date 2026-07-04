import { useState, useEffect } from 'react';

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [instructores, setInstructores] = useState([]);
  
  const [nuevaReserva, setNuevaReserva] = useState({
    alumno: '',
    instructor: '',
    fecha: '',
    hora: '',
    estado: 'Programada'
  });
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  const cargarReservas = () => {
    fetch('http://localhost:3000/reservas')
      .then(res => res.json())
      .then(datos => setReservas(datos))
      .catch(err => console.error('Error al cargar reservas:', err));
  };

  useEffect(() => {
    // Cargamos todo al mismo tiempo cuando la pantalla se abre
    Promise.all([
      fetch('http://localhost:3000/reservas').then(res => res.json()),
      fetch('http://localhost:3000/alumnos').then(res => res.json()),
      fetch('http://localhost:3000/instructores').then(res => res.json())
    ])
    .then(([datosReservas, datosAlumnos, datosInstructores]) => {
      setReservas(datosReservas);
      setAlumnos(datosAlumnos);
      setInstructores(datosInstructores);
    })
    .catch(err => console.error('Error al cargar datos:', err));
  }, []);

  const manejarCambio = (e) => {
    setNuevaReserva({
      ...nuevaReserva,
      [e.target.name]: e.target.value
    });
  };

  const manejarEditar = (reserva) => {
    const fechaLimpia = reserva.fecha ? reserva.fecha.split('T')[0] : '';
    
    setNuevaReserva({
      alumno: reserva.alumno.id,         
      instructor: reserva.instructor.id, 
      fecha: fechaLimpia,
      hora: reserva.hora,
      estado: reserva.estado
    });
    setModoEdicion(true);
    setIdEdicion(reserva.id);
  };

  const cancelarEdicion = () => {
    setNuevaReserva({ alumno: '', instructor: '', fecha: '', hora: '', estado: 'Programada' });
    setModoEdicion(false);
    setIdEdicion(null);
  };

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    
    const url = modoEdicion ? `http://localhost:3000/reservas/${idEdicion}` : 'http://localhost:3000/reservas';
    const metodo = modoEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaReserva)
    })
    .then(() => {
      cargarReservas(); // Volvemos a pedir las reservas actualizadas
      cancelarEdicion(); // Limpiamos el formulario
    })
    .catch(err => console.error('Error al guardar:', err));
  };

  const manejarEliminar = (id) => {
    const confirmar = window.confirm('¿Estás seguro de cancelar y eliminar esta reserva?');
    if (confirmar) {
      fetch(`http://localhost:3000/reservas/${id}`, {
        method: 'DELETE',
      })
      .then(() => {
        const nuevaLista = reservas.filter(res => res.id !== id);
        setReservas(nuevaLista);
      })
      .catch(err => console.error('Error al eliminar:', err));
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Reservas</h2>
      </div>
      
      <div className="row">
        {/* Formulario */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className={`card-header text-white ${modoEdicion ? 'bg-success' : 'bg-info text-dark'}`}>
              <h5 className="mb-0 fw-bold">{modoEdicion ? '✏️ Editar Reserva' : '📅 Agendar Clase'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={manejarEnvio}>
                
                {/* Selector de Alumno */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Alumno</label>
                  <select className="form-select" name="alumno" value={nuevaReserva.alumno} onChange={manejarCambio} required>
                    <option value="">Seleccione un alumno...</option>
                    {alumnos.map(al => (
                      <option key={al.id} value={al.id}>{al.nombre} {al.apellido} ({al.rut})</option>
                    ))}
                  </select>
                </div>

                {/* Selector de Instructor */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Instructor</label>
                  <select className="form-select" name="instructor" value={nuevaReserva.instructor} onChange={manejarCambio} required>
                    <option value="">Seleccione un instructor...</option>
                    {instructores.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.nombre} {inst.apellido} - {inst.licencia}</option>
                    ))}
                  </select>
                </div>

                {/* Fecha y Hora */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Fecha</label>
                    <input type="date" className="form-control" name="fecha" value={nuevaReserva.fecha} onChange={manejarCambio} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Hora</label>
                    <input type="time" className="form-control" name="hora" value={nuevaReserva.hora} onChange={manejarCambio} required />
                  </div>
                </div>

                {/* Estado */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">Estado de la Clase</label>
                  <select className="form-select" name="estado" value={nuevaReserva.estado} onChange={manejarCambio}>
                    <option value="Programada">Programada</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
                
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${modoEdicion ? 'btn-success' : 'btn-info text-white'}`}>
                    {modoEdicion ? 'Actualizar Reserva' : 'Guardar Reserva'}
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
                      <th className="ps-4">N°</th>
                      <th>Fecha y Hora</th>
                      <th>Alumno</th>
                      <th>Instructor</th>
                      <th>Estado</th>
                      <th className="text-center pe-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-5 text-muted">No hay clases agendadas aún.</td></tr>
                    ) : (
                      reservas.map((reserva) => {
                        // Extraemos la fecha limpia para mostrarla bonita
                        const fechaVisual = reserva.fecha ? reserva.fecha.split('T')[0] : '';
                        return (
                          <tr key={reserva.id}>
                            <td className="ps-4 text-muted fw-bold">#{reserva.id}</td>
                            <td>
                              <div className="fw-medium text-dark">{fechaVisual}</div>
                              <div className="text-muted small">⏱️ {reserva.hora} hrs</div>
                            </td>
                            <td>
                              {reserva.alumno ? `${reserva.alumno.nombre} ${reserva.alumno.apellido}` : '⚠️ Borrado'}
                            </td>
                            <td>
                              {reserva.instructor ? `${reserva.instructor.nombre} ${reserva.instructor.apellido}` : '⚠️ Borrado'}
                            </td>
                            <td>
                              <span className={`badge ${reserva.estado === 'Programada' ? 'bg-primary' : reserva.estado === 'Completada' ? 'bg-success' : 'bg-danger'}`}>
                                {reserva.estado}
                              </span>
                            </td>
                            <td className="text-center pe-4">
                              <div className="d-flex justify-content-center gap-2">
                                <button onClick={() => manejarEditar(reserva)} className="btn btn-sm btn-outline-primary px-3" style={{ borderRadius: '20px' }}>✏️</button>
                                <button onClick={() => manejarEliminar(reserva.id)} className="btn btn-sm btn-outline-danger px-3" style={{ borderRadius: '20px' }}>🗑️</button>
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

export default Reservas;