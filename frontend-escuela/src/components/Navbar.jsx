import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🏁 AutoEscuela UBB</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto fw-medium">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/alumnos">Alumnos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/instructores">Instructores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reservas">Reservas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/evaluaciones">Evaluaciones</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;