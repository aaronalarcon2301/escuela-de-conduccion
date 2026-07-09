import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home'; 
import Alumnos from './pages/Alumnos';
import Instructores from './pages/Instructores';
import Reservas from './pages/Reservas';
import Evaluaciones from './pages/Evaluaciones';

function App() {
  const [estaLogueado, setEstaLogueado] = useState(false);

  if (!estaLogueado) {
    return <Login onLogin={() => setEstaLogueado(true)} />;
  }

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/instructores" element={<Instructores />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/evaluaciones" element={<Evaluaciones />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;