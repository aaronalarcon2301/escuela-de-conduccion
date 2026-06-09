const express = require('express');
const router = express.Router();
const { reservarClase } = require('../controllers/reservaController');

router.post('/', reservarClase);

module.exports = router;