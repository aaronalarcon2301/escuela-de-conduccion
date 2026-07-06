import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; 
import Home from './pages/Home';
import Alumnos from './pages/Alumnos';
import Instructores from './pages/Instructores';
import Reservas from './pages/Reservas';
import Evaluaciones from './pages/Evaluaciones';

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
            <Route path="/instructores" element={<Instructores />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/evaluaciones" element={<Evaluaciones />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;