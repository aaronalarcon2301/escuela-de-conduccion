import { Link } from 'react-router-dom';
import './Home.css'; // Importamos las animaciones

function Home() {
  return (
    <div className="container py-5 px-4">
      <div className="row justify-content-center text-center mt-4 mb-5 fade-in-up">
        <div className="col-lg-8">
          <h1 className="display-4 fw-bolder text-dark mb-3" style={{ letterSpacing: '-1.5px' }}>
            Gestión <span className="text-gradient">Inteligente</span>
          </h1>
          <p className="lead text-muted fade-in-up delay-1">
            Administra tu autoescuela con un sistema rápido, fluido y diseñado para darte el control total desde cualquier dispositivo.
          </p>
        </div>
      </div>

      <div className="row g-4 max-w-900 mx-auto fade-in-up delay-2">
        
        <div className="col-12 col-md-6 col-lg-3">
          <Link to="/alumnos" className="card home-card shadow-sm border text-decoration-none h-100 text-center">
            <div className="card-body py-5">
              <div className="icon-box bg-dark text-white rounded-4 mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm">
                👨‍🎓
              </div>
              <h5 className="card-title text-dark fw-bold mb-2">Alumnos</h5>
              <p className="card-text text-muted small mb-0">Gestión de matrículas, datos y registros</p>
            </div>
          </Link>
        </div>

        {/* Tarjeta Instructores */}
        <div className="col-12 col-md-6 col-lg-3">
          <Link to="/instructores" className="card home-card shadow-sm border text-decoration-none h-100 text-center">
            <div className="card-body py-5">
              <div className="icon-box bg-dark text-white rounded-4 mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm">
                🚗
              </div>
              <h5 className="card-title text-dark fw-bold mb-2">Instructores</h5>
              <p className="card-text text-muted small mb-0">Disponibilidad y asignación de flota</p>
            </div>
          </Link>
        </div>

        {/* Tarjeta Reservas */}
        <div className="col-12 col-md-6 col-lg-3">
          <Link to="/reservas" className="card home-card shadow-sm border text-decoration-none h-100 text-center">
            <div className="card-body py-5">
              <div className="icon-box bg-dark text-white rounded-4 mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm">
                📅
              </div>
              <h5 className="card-title text-dark fw-bold mb-2">Reservas</h5>
              <p className="card-text text-muted small mb-0">Agenda de clases prácticas y teóricas</p>
            </div>
          </Link>
        </div>

        {/* Tarjeta Evaluaciones */}
        <div className="col-12 col-md-6 col-lg-3">
          <Link to="/evaluaciones" className="card home-card shadow-sm border text-decoration-none h-100 text-center">
            <div className="card-body py-5">
              <div className="icon-box bg-dark text-white rounded-4 mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm">
                📋
              </div>
              <h5 className="card-title text-dark fw-bold mb-2">Evaluaciones</h5>
              <p className="card-text text-muted small mb-0">Rendimiento y progreso del alumno</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;