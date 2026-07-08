import { useState } from 'react';

function Login({ onLogin }) {
  const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });
  const [error, setError] = useState(false);

  const manejarCambio = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
    setError(false);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    if (credenciales.usuario === 'escuelaubb@gmail.com' && credenciales.password === '123456') {
      onLogin(); 
    } else {
      setError(true); 
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
              ⚠️ Usuario o contraseña incorrectos
            </div>
          )}

          <form onSubmit={manejarEnvio}>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">Usuario</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                name="usuario" 
                placeholder="Ej: admin"
                value={credenciales.usuario} 
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
            
            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold">
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;