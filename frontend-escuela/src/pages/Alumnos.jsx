import { useState, useEffect } from 'react';

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/alumnos')
      .then((respuesta) => respuesta.json())
      .then((datos) => setAlumnos(datos))
      .catch((error) => console.error('Error al cargar:', error));
  }, []);

  const manejarCambio = (e) => {
    setNuevoAlumno({
      ...nuevoAlumno,
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
    setNuevoAlumno({
      ...nuevoAlumno,
      rut: formatearRUT(nuevoAlumno.rut)
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    
    fetch('http://localhost:3000/alumnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoAlumno)
    })
    .then(res => res.json())
    .then(data => {
      setAlumnos([...alumnos, data]);
      setNuevoAlumno({ nombre: '', apellido: '', rut: '', email: '', telefono: '' });
    })
    .catch(err => console.error('Error al guardar:', err));
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Alumnos</h2>
      </div>
      
      <div className="row">
        {/* Formulario */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Registrar Nuevo Alumno</h5>
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
                    placeholder="Ej: 123456789 (presiona Tab)" 
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
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">Teléfono</label>
                  <input type="text" className="form-control" name="telefono" placeholder="+569..." value={nuevoAlumno.telefono} onChange={manejarCambio} />
                </div>
                <button type="submit" className="btn btn-primary w-100">Guardar Alumno</button>
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
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
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