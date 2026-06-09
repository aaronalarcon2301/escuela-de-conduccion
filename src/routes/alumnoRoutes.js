const express = require('express');
const router = express.Router();
const { 
  crearAlumno, 
  obtenerAlumnos, 
  actualizarAlumno, 
  eliminarAlumno 
} = require('../controllers/alumnoController');

router.post('/', crearAlumno);
router.get('/', obtenerAlumnos);
router.patch('/:id', actualizarAlumno);
router.delete('/:id', eliminarAlumno);

module.exports = router;