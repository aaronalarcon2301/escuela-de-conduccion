const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');

router.post('/', evaluacionController.crearEvaluacion);
router.get('/', evaluacionController.obtenerEvaluaciones);
router.put('/:id', evaluacionController.actualizarEvaluacion);
router.delete('/:id', evaluacionController.eliminarEvaluacion);

module.exports = router;