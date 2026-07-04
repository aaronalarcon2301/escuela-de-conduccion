import { useState, useEffect } from 'react';

function Instructores() {
  const [instructores, setInstructores] = useState([]);
  
  const [nuevoInstructor, setNuevoInstructor] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    licencia: 'Clase B' 
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/instructores')
      .then((respuesta) => respuesta.json())
      .then((datos) => setInstructores(datos))
      .catch((error) => console.error('Error al cargar:', error));
  }, []);

  const manejarCambio = (e) => {
    setNuevoInstructor({
      ...nuevoInstructor,
      [e.target.name]: e.target.value
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
    setNuevoInstructor({
      ...nuevoInstructor,
      rut: formatearRUT(nuevoInstructor.rut)
    });
  };

  const manejarEditar = (instructor) => {
    setNuevoInstructor({
      nombre: instructor.nombre,
      apellido: instructor.apellido,
      rut: instructor.rut,
      email: instructor.email,
      telefono: instructor.telefono || '',
      licencia: instructor.licencia || 'Clase B'
    });
    setModoEdicion(true);
    setIdEdicion(instructor.id);
  };

  const cancelarEdicion = () => {
    setNuevoInstructor({ nombre: '', apellido: '', rut: '', email: '', telefono: '', licencia: 'Clase B' });
    setModoEdicion(false);
    setIdEdicion(null);
  };

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    
    if (modoEdicion) {
      fetch(`http://localhost:3000/instructores/${idEdicion}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoInstructor)
      })
      .then(res => res.json())
      .then(data => {
        const listaActualizada = instructores.map(inst => inst.id === idEdicion ? data : inst);
        setInstructores(listaActualizada);
        cancelarEdicion();
      })
      .catch(err => console.error('Error al actualizar:', err));
    } else {
      fetch('http://localhost:3000/instructores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoInstructor)
      })
      .then(res => res.json())
      .then(data => {
        setInstructores([...instructores, data]);
        setNuevoInstructor({ nombre: '', apellido: '', rut: '', email: '', telefono: '', licencia: 'Clase B' });
      })
      .catch(err => console.error('Error al guardar:', err));
    }
  };

  const manejarEliminar = (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar a este instructor?');
    if (confirmar) {
      fetch(`http://localhost:3000/instructores/${id}`, {
        method: 'DELETE',
      })
      .then(() => {
        const nuevaLista = instructores.filter(inst => inst.id !== id);
        setInstructores(nuevaLista);
      })
      .catch(err => console.error('Error al eliminar:', err));
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Instructores</h2>
      </div>
      
      <div className="row">
        {/* Formulario */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className={`card-header text-white ${modoEdicion ? 'bg-success' : 'bg-dark'}`}>
              <h5 className="mb-0">{modoEdicion ? '✏️ Editar Instructor' : 'Registrar Instructor'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={nuevoInstructor.nombre} onChange={manejarCambio} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Apellido</label>
                  <input type="text" className="form-control" name="apellido" value={nuevoInstructor.apellido} onChange={manejarCambio} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">RUT</label>
                  <input type="text" className="form-control" name="rut" placeholder="Ej: 12.345.678-9" value={nuevoInstructor.rut} onChange={manejarCambio} onBlur={manejarBlurRut} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Teléfono</label>
                    <input type="text" className="form-control" name="telefono" placeholder="Ej: 987654321" value={nuevoInstructor.telefono} onChange={manejarCambio} />
                  </div>
                  {/* NUEVO CAMPO: Selector de Licencia */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Licencia</label>
                    <select className="form-select" name="licencia" value={nuevoInstructor.licencia} onChange={manejarCambio}>
                      <option value="Clase B">Clase B (Auto)</option>
                      <option value="Clase C">Clase C (Moto)</option>
                      <option value="Profesional">Profesional</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">Email</label>
                  <input type="email" className="form-control" name="email" value={nuevoInstructor.email} onChange={manejarCambio} required />
                </div>
                
                <div className="d-grid gap-2">
                  <button type="submit" className={`btn ${modoEdicion ? 'btn-success' : 'btn-dark'}`}>
                    {modoEdicion ? 'Actualizar Instructor' : 'Guardar Instructor'}
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
                  <thead className="table-secondary text-dark">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Nombre</th>
                      <th>RUT</th>
                      <th>Licencia</th>
                      <th>Contacto</th>
                      <th className="text-center pe-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructores.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-5 text-muted">No hay instructores registrados.</td></tr>
                    ) : (
                      instructores.map((inst) => (
                        <tr key={inst.id}>
                          <td className="ps-4 text-muted">{inst.id}</td>
                          <td className="fw-medium">{inst.nombre} {inst.apellido}</td>
                          <td>{inst.rut}</td>
                          <td>
                            <span className={`badge ${inst.licencia === 'Profesional' ? 'bg-danger' : inst.licencia === 'Clase C' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                              {inst.licencia}
                            </span>
                          </td>
                          <td className="small">
                            <div>{inst.email}</div>
                            <div className="text-muted">{inst.telefono}</div>
                          </td>
                          <td className="text-center pe-4">
                            <div className="d-flex justify-content-center gap-2">
                              <button onClick={() => manejarEditar(inst)} className="btn btn-sm btn-outline-primary px-3" style={{ borderRadius: '20px' }}>✏️</button>
                              <button onClick={() => manejarEliminar(inst.id)} className="btn btn-sm btn-outline-danger px-3" style={{ borderRadius: '20px' }}>🗑️</button>
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

export default Instructores;