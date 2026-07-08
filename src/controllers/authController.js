const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const usuario = await authService.registrarUsuario(req.body);
    res.status(201).json({ usuario, mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al registrar el usuario' });
  }
};

const login = async (req, res) => {
  try {
    const resultado = await authService.iniciarSesion(req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(401).json({ error: error.message || 'Error al iniciar sesion' });
  }
};

module.exports = { register, login };
