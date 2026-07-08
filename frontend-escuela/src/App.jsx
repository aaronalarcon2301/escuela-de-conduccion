import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home'; // <-- Importamos tu Home original
import Alumnos from './pages/Alumnos';
import Instructores from './pages/Instructores';
import Reservas from './pages/Reservas';
import Evaluaciones from './pages/Evaluaciones';

function App() {
  // Estado que bloquea el sistema por defecto (false)
  const [estaLogueado, setEstaLogueado] = useState(false);

  // Si el candado está cerrado, solo mostramos la pantalla de Login
  if (!estaLogueado) {
    return <Login onLogin={() => setEstaLogueado(true)} />;
  }

  // Si el candado está abierto, mostramos el sistema completo
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* La raíz del sistema ahora cargará de inmediato tu Home con su hermoso diseño */}
          <Route path="/" element={<Home />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/instructores" element={<Instructores />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/evaluaciones" element={<Evaluaciones />} />
          
          {/* Por si acaso intentan ir a una ruta inexistente, los redirigimos al Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;