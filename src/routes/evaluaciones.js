const express = require('express');
const evaluacionController = require('../controllers/evaluacionController');
const router = express.Router();

router.post('/', evaluacionController.crearEvaluacion);
router.get('/', evaluacionController.obtenerEvaluaciones);
router.get('/alumnos/:id', evaluacionController.obtenerEvaluacionesPorAlumno);
router.patch('/:id', evaluacionController.actualizarEvaluacion);
router.delete('/:id', evaluacionController.eliminarEvaluacion);

module.exports = router;