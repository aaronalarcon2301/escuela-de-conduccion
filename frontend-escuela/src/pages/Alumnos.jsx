import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/alumnos';

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [mensajeError, setMensajeError] = useState(null);

  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    pagos_al_dia: true
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  const cargarAlumnos = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const datos = await res.json();
      setAlumnos(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      setMensajeError('No se pudo cargar la lista de alumnos. ¿Está corriendo el backend en el puerto 3000?');
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    let valorFinal = value;
    if (name === 'pagos_al_dia') {
      valorFinal = value === 'true';
    }

    setNuevoAlumno({
      ...nuevoAlumno,
      [name]: valorFinal
    });
  };

  const formatearRUT = (rut) => {
    const valorLimpio = rut.replace(/[^0-9kK]/g, '');
    if (valorLimpio.length === 0) return '';
    if (valorLimpio.length <= 1) return valorLimpio.toUpperCase();
    const cuerpo = valorLimpio.slice(0, -1);
    const dv = valorLimpio.slice(-1).toUpperCase();
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${dv}`;
  };

  const manejarBlurRut = () => {
    setNuevoAlumno({
      ...nuevoAlumno,
      rut: formatearRUT(nuevoAlumno.rut)
    });
  };

  const manejarEditar = (alumno) => {
    setNuevoAlumno({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      rut: alumno.rut,
      email: alumno.email,
      telefono: alumno.telefono || '',
      pagos_al_dia: alumno.pagos_al_dia !== undefined ? alumno.pagos_al_dia : true
    });
    setModoEdicion(true);
    setIdEdicion(alumno.id);
    setMensajeError(null);
  };

  const cancelarEdicion = () => {
    setNuevoAlumno({ nombre: '', apellido: '', rut: '', email: '', telefono: '', pagos_al_dia: true });
    setModoEdicion(false);
    setIdEdicion(null);
    setMensajeError(null);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensajeError(null);

    const url = modoEdicion ? `${API_URL}/${idEdicion}` : API_URL;

    try {
      const res = await fetch(url, {
        method: modoEdicion ? 'PATCH' : 'POST', // el backend define PATCH, no PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoAlumno)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMensajeError((data && data.error) || `Error del servidor (HTTP ${res.status})`);
        return;
      }

      await cargarAlumnos();
      cancelarEdicion();
    } catch (err) {
      console.error('Error de red:', err);
      setMensajeError('No se pudo conectar con el servidor. ¿Está corriendo el backend en el puerto 3000?');
    }
  };

  const manejarEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar a este alumno? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setMensajeError((data && data.error) || `Error al eliminar (HTTP ${res.status})`);
        return;
      }

      await cargarAlumnos();
    } catch (err) {
      console.error('Error al eliminar:', err);
      setMensajeError('No se pudo conectar con el servidor al intentar eliminar.');
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Alumnos</h2>
      </div>

      {mensajeError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {mensajeError}
          <button type="button" className="btn-close" onClick={() => setMensajeError(null)}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className={`card-header text-white ${modoEdicion ? 'bg-success' : 'bg-primary'}`}>
              <h5 className="mb-0">{modoEdicion ? '✏️ Editar Alumno' : 'Registrar Nuevo Alumno'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={nuevoAlumno.nombre} onChange={manejarCambio} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Apellido</label>
                  <input type="text" className="form-control" name="apellido" value={nuevoAlumno.apellido} onChange={manejarCambio} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">RUT</label>
                  <input
                    type="text"
                    className="form-control"
                    name="rut"
                    placeholder="Ej: 12.345.678-9"
                    value={nuevoAlumno.rut}
                    onChange={manejarCambio}
                    onBlur={manejarBlurRut}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Email</label>
                  <input type="email" className="form-control" name="email" value={nuevoAlumno.email} onChange={manejarCambio} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Teléfono</label>
                  <input type="text" className="form-control" name="telefono" placeholder="Ej: 987654321" value={nuevoAlumno.telefono} onChange={manejarCambio} />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">Estado de Pago</label>
                  <select
                    className="form-select"
                    name="pagos_al_dia"
                    value={String(nuevoAlumno.pagos_al_dia)}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="true">Al día</option>
                    <option value="false">Registra deuda</option>
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${modoEdicion ? 'btn-success' : 'btn-primary'}`}>
                    {modoEdicion ? 'Actualizar Alumno' : 'Guardar Alumno'}
                  </button>
                  {modoEdicion && (
                    <button type="button" className="btn btn-light border" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
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
                  <thead className="table-dark">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Nombre Completo</th>
                      <th>RUT</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th className="text-center">Estado Pago</th>
                      <th className="text-center pe-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          No hay alumnos registrados en el sistema.
                        </td>
                      </tr>
                    ) : (
                      alumnos.map((alumno) => (
                        <tr key={alumno.id}>
                          <td className="ps-4">{alumno.id}</td>
                          <td className="fw-medium">{alumno.nombre} {alumno.apellido}</td>
                          <td>{alumno.rut}</td>
                          <td>{alumno.email}</td>
                          <td>{alumno.telefono || 'N/A'}</td>

                          <td className="text-center">
                            {alumno.pagos_al_dia ? (
                              <span className="badge bg-success rounded-pill px-3 py-2">Al Día</span>
                            ) : (
                              <span className="badge bg-danger rounded-pill px-3 py-2">Deuda</span>
                            )}
                          </td>

                          <td className="text-center pe-4">
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                onClick={() => manejarEditar(alumno)}
                                className="btn btn-sm btn-outline-primary transition-all px-3"
                                style={{ borderRadius: '20px' }}
                                title="Editar registro"
                              >
                                ✏️
                              </button>

                              <button
                                onClick={() => manejarEliminar(alumno.id)}
                                className="btn btn-sm btn-outline-danger transition-all px-3"
                                style={{ borderRadius: '20px' }}
                                title="Eliminar registro"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
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

export default Alumnos;