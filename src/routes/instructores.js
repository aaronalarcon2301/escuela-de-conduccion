const express = require('express');
const instructorController = require('../controllers/instructorController');
const router = express.Router();

router.post('/', instructorController.crearInstructor);
router.get('/', instructorController.obtenerInstructores);
router.get('/:id', instructorController.obtenerInstructorPorId);
router.patch('/:id', instructorController.actualizarInstructor);
router.put('/:id', instructorController.actualizarInstructor);
router.delete('/:id', instructorController.eliminarInstructor);

module.exports = router;