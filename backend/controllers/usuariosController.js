const usuarioModel = require('../models/usuarioModel');

exports.getAllUsers = async (req, res) => {
  try {
    const usuarios = await usuarioModel.getAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

exports.createUser = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const existe = await usuarioModel.existsByEmail(email);
    if (existe) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    await usuarioModel.create({ nombre, email, password, rol });
    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await usuarioModel.getById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;

  try {
    await usuarioModel.update(id, { nombre, email, rol });
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await usuarioModel.softDelete(id);
    res.json({ message: 'Usuario dado de baja correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};
