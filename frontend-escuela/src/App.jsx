import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; 
import Home from './pages/Home';
import Alumnos from './pages/Alumnos';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">🏁 AutoEscuela UBB</Link>
            
            <div className="navbar-collapse">
              <div className="navbar-nav ms-auto d-flex flex-row gap-3">
                <Link className="nav-link" to="/alumnos">Alumnos</Link>
                <Link className="nav-link" to="/instructores">Instructores</Link>
                <Link className="nav-link" to="/reservas">Reservas</Link>
                <Link className="nav-link" to="/evaluaciones">Evaluaciones</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container pb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alumnos" element={<Alumnos />} />
            <Route path="/instructores" element={<h2 className="mt-5 text-center text-muted">Módulo de Instructores (En construcción)</h2>} />
            <Route path="/reservas" element={<h2 className="mt-5 text-center text-muted">Módulo de Reservas (En construcción)</h2>} />
            <Route path="/evaluaciones" element={<h2 className="mt-5 text-center text-muted">Módulo de Evaluaciones (En construcción)</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;