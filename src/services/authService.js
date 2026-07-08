const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/db');

const SALT_ROUNDS = 10;

const registrarUsuario = async (datos) => {
  const usuarioRepository = AppDataSource.getRepository('Usuario');

  if (!datos.email || !datos.password) {
    throw new Error('Email y contrasena son obligatorios');
  }

  const existente = await usuarioRepository.findOneBy({ email: datos.email });
  if (existente) {
    throw new Error('Ya existe un usuario registrado con ese email');
  }

  const passwordHasheada = await bcrypt.hash(datos.password, SALT_ROUNDS);

  const nuevoUsuario = usuarioRepository.create({
    nombre: datos.nombre,
    email: datos.email,
    password: passwordHasheada,
    rol: datos.rol || 'admin'
  });

  const usuarioGuardado = await usuarioRepository.save(nuevoUsuario);
  const { password, ...usuarioSinPassword } = usuarioGuardado;
  return usuarioSinPassword;
};

const iniciarSesion = async (datos) => {
  const usuarioRepository = AppDataSource.getRepository('Usuario');

  if (!datos.email || !datos.password) {
    throw new Error('Email y contrasena son obligatorios');
  }

  const usuario = await usuarioRepository.findOneBy({ email: datos.email });
  if (!usuario) {
    throw new Error('Credenciales invalidas');
  }

  const passwordValida = await bcrypt.compare(datos.password, usuario.password);
  if (!passwordValida) {
    throw new Error('Credenciales invalidas');
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET || 'clave-secreta-de-desarrollo-cambiar-en-produccion',
    { expiresIn: '2h' }
  );

  const { password, ...usuarioSinPassword } = usuario;
  return { token, usuario: usuarioSinPassword };
};

module.exports = { registrarUsuario, iniciarSesion };
