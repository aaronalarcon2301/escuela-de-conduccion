import { useState, useEffect } from 'react';

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [instructores, setInstructores] = useState([]);
  
  // CORRECCIÓN: Usamos alumnoId e instructorId para coincidir con el Backend
  const [nuevaReserva, setNuevaReserva] = useState({
    alumnoId: '',
    instructorId: '',
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
      alumnoId: reserva.alumno ? reserva.alumno.id : '',         
      instructorId: reserva.instructor ? reserva.instructor.id : '', 
      fecha: fechaLimpia,
      hora: reserva.hora,
      estado: reserva.estado
    });
    setModoEdicion(true);
    setIdEdicion(reserva.id);
  };

  const cancelarEdicion = () => {
    setNuevaReserva({ alumnoId: '', instructorId: '', fecha: '', hora: '', estado: 'Programada' });
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
    // CORRECCIÓN: Validamos si la respuesta del servidor es correcta (status 200-299)
    .then(async res => {
      if (!res.ok) {
        const errorData = await res.json();
        // Si el backend arrojó un error (como el bloqueo de pagos), lanzamos una excepción
        throw new Error(errorData.error || errorData.message || 'Error en la operación');
      }
      return res.json();
    })
    .then(() => {
      cargarReservas(); 
      cancelarEdicion(); 
    })
    .catch(err => {
      // Ahora el sistema sí te avisará en pantalla si algo falló
      alert(`⚠️ No se pudo agendar: ${err.message}`);
      console.error('Error al guardar:', err);
    });
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

  // VALIDACIÓN VISUAL DEL REQUISITO: Buscamos si el alumno seleccionado está moroso
  const alumnoSeleccionado = alumnos.find(al => al.id === parseInt(nuevaReserva.alumnoId));
  const estaBloqueadoPorPago = alumnoSeleccionado && alumnoSeleccionado.pagos_al_dia === false;

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
              <h5 className="mb-0 fw-bold">{modoEdicion ? 'Editar Reserva' : 'Agendar Clase'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={manejarEnvio}>
                
                {/* Selector de Alumno (Cambiado name a alumnoId) */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Alumno</label>
                  <select className="form-select" name="alumnoId" value={nuevaReserva.alumnoId} onChange={manejarCambio} required>
                    <option value="">Seleccione un alumno...</option>
                    {alumnos.map(al => (
                      <option key={al.id} value={al.id}>
                        {al.nombre} {al.apellido} ({al.rut}) {al.pagos_al_dia === false ? '⚠️ MOROSO' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* RESTRICCIÓN VISUAL: Letrero de aviso si el alumno debe mensualidades */}
                {estaBloqueadoPorPago && (
                  <div className="alert alert-danger fw-bold small py-2 animate__animated animate__fadeIn" role="alert">
                    ❌ Restricción: Este alumno registra deudas pendientes y no puede agendar clases prácticas.
                  </div>
                )}

                {/* Selector de Instructor (Cambiado name a instructorId) */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Instructor</label>
                  <select className="form-select" name="instructorId" value={nuevaReserva.instructorId} onChange={manejarCambio} required>
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
                  <button 
                    type="submit" 
                    className={`btn fw-bold ${estaBloqueadoPorPago ? 'btn-secondary' : modoEdicion ? 'btn-success' : 'btn-info text-white'}`}
                    disabled={estaBloqueadoPorPago}
                  >
                    {estaBloqueadoPorPago ? 'Agendamiento Bloqueado' : modoEdicion ? 'Actualizar Reserva' : 'Guardar Reserva'}
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

export default Reservas;