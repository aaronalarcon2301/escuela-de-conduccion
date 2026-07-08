import { useState } from 'react';

function Login({ onLogin }) {
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // Muestra el error real que devuelve el backend (ej: "Credenciales inválidas")
        setError(datos.error || 'Usuario o contraseña incorrectos');
        return;
      }

      // Guardamos el token y el usuario para poder usarlos después
      sessionStorage.setItem('token', datos.token);
      sessionStorage.setItem('usuario', JSON.stringify(datos.usuario));

      onLogin();
    } catch (error) {
      setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-header bg-dark text-white text-center py-4">
          <h3 className="mb-0 fw-bold">🏁 AutoEscuela UBB</h3>
          <p className="mb-0 small text-white-50">Sistema de Gestión Académica</p>
        </div>
        <div className="card-body p-4">

          {error && (
            <div className="alert alert-danger py-2 text-center small fw-bold" role="alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={manejarEnvio}>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                name="email"
                placeholder="usuario@ejemplo.com"
                value={credenciales.email}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small fw-bold">Contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg"
                name="password"
                placeholder="******"
                value={credenciales.password}
                onChange={manejarCambio}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar al Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;