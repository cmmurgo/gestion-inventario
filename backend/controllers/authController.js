// controllers/authController.js
const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');

// Función para el login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (user.fecha_baja) {
      return res.status(403).json({ message: 'Usuario dado de baja' });
    }

    const match = await authModel.comparePassword(password, user.clave);

    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, email: user.email, role: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login exitoso', token, user: { name: user.nombre, role: user.rol } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para el registro
exports.register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    const existing = await authModel.getUserByEmail(email);

    if (existing) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    await authModel.createUser({ nombre, email, password, rol });
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};
